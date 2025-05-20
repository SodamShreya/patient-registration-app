import { useEffect, useState } from 'react';
import { PGlite } from '@electric-sql/pglite';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import 'flag-icon-css/css/flag-icons.min.css';
import './phoneInputFix.css';

function App() {
  const [db, setDb] = useState(null);
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    bloodGroup: '',
    emergencyContact: ''
  });
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState([]);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const initDb = async () => {
      try {
        const dbInstance = new PGlite();
        setDb(dbInstance);

        await dbInstance.exec(`
          CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            age INTEGER,
            gender TEXT,
            phone TEXT,
            address TEXT,
            bloodGroup TEXT,
            emergencyContact TEXT
          );
        `);
        console.log("✅ PGlite initialized");
      } catch (err) {
        console.error("❌ Failed DB init:", err);
      }
    };
    initDb();
  }, []);

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db) return alert("Database is not ready yet.");

    const { name, age, gender, phone, address, bloodGroup, emergencyContact } = patient;
    const query = `
      INSERT INTO patients (name, age, gender, phone, address, bloodGroup, emergencyContact)
      VALUES ('${name}', ${age}, '${gender}', '${phone}', '${address}', '${bloodGroup}', '${emergencyContact}');
    `;

    try {
      await db.exec(query);
      alert('✅ Patient Registered Successfully!');
      setPatient({ name: '', age: '', gender: '', phone: '', address: '', bloodGroup: '', emergencyContact: '' });
    } catch (err) {
      alert('❌ Error while inserting data: ' + err.message);
    }
  };

  const handleRunQuery = async () => {
    if (!db) return alert("DB not ready");
    try {
      const res = await db.query(query);
      setQueryResult(res.rows);
    } catch (err) {
      alert("Query failed: " + err.message);
    }
  };

  if (!db) {
    return (
      <div className="min-h-screen w-screen bg-blue-600 flex items-center justify-center text-white text-xl">
        🔄 Initializing Database...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-3xl p-10 space-y-6">
        <div className="flex justify-center space-x-6">
          <button
            className={`px-6 py-2 rounded-lg text-lg font-semibold ${showLogin ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
          <button
            className={`px-6 py-2 rounded-lg text-lg font-semibold ${!showLogin ? 'bg-blue-700 text-white' : 'bg-gray-200'}`}
            onClick={() => setShowLogin(false)}
          >
            Register
          </button>
        </div>

        {showLogin ? (
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-blue-700">Login</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-blue-700 font-medium mb-1">Email:</label>
                <input type="email" className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <div>
                <label className="block text-blue-700 font-medium mb-1">Password:</label>
                <input type="password" className="w-full border rounded-lg px-3 py-2" required />
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
                Login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-3xl font-bold text-center text-blue-700">Patient Registration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[{ label: 'Name', name: 'name', type: 'text' }, { label: 'Age', name: 'age', type: 'number' }].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block mb-1 font-medium text-blue-700">{label}:</label>
                  <input
                    type={type}
                    name={name}
                    value={patient[name]}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block mb-1 font-medium text-blue-700">Gender:</label>
                <select name="gender" value={patient.gender} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required>
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-blue-700">Blood Group:</label>
                <select name="bloodGroup" value={patient.bloodGroup} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required>
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-blue-700">Phone Number:</label>
                <PhoneInput
                  country={'in'}
                  value={patient.phone}
                  onChange={(phone) => setPatient({ ...patient, phone })}
                  inputStyle={{ width: '100%', color: 'black' }}
                  containerStyle={{ width: '100%' }}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-blue-700">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={patient.address}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 font-medium text-blue-700">Emergency Contact:</label>
                <PhoneInput
                  country={'in'}
                  value={patient.emergencyContact}
                  onChange={(val) => setPatient({ ...patient, emergencyContact: val })}
                  inputStyle={{ width: '100%', color: 'black' }}
                  containerStyle={{ width: '100%' }}
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700">
              Register Patient
            </button>
          </form>
        )}

        {!showLogin && (
          <div className="pt-6">
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Run SQL Query</h3>
            <textarea
              rows="4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded-lg p-2 font-mono mb-2"
              placeholder="SELECT * FROM patients;"
            />
            <button onClick={handleRunQuery} className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg mb-4">
              Run Query
            </button>

            {queryResult.length > 0 && (
              <table className="w-full text-sm border border-gray-300">
                <thead className="bg-blue-100">
                  <tr>
                    {Object.keys(queryResult[0]).map((col) => (
                      <th key={col} className="border px-2 py-1">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResult.map((row, index) => (
                    <tr key={index}>
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="border px-2 py-1">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
