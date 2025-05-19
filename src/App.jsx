import { useState, useEffect } from 'react';
import { PGlite } from '@electric-sql/pglite'; // Import PGlite
import './tailwind.css'; // Import Tailwind CSS

function App() {
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    bloodGroup: '',
    emergencyContact: ''
  });

  const [db, setDb] = useState(null);

  // Initialize PGlite database
  useEffect(() => {
    const initDb = async () => {
      const dbInstance = new PGlite({ filename: 'patients.db' });

      // Create table if not exists
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

      setDb(dbInstance);
    };

    initDb();
  }, []);

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!db) {
      alert("Database not initialized yet.");
      return;
    }

    const { name, age, gender, phone, address, bloodGroup, emergencyContact } = patient;

    // Insert data into the database
    await db.exec({
      sql: `
        INSERT INTO patients (name, age, gender, phone, address, bloodGroup, emergencyContact)
        VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      args: [name, age, gender, phone, address, bloodGroup, emergencyContact]
    });

    alert("Patient registered successfully ✅");

    // Clear the form
    setPatient({
      name: '',
      age: '',
      gender: '',
      phone: '',
      address: '',
      bloodGroup: '',
      emergencyContact: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl mb-6 font-semibold text-center">Patient Registration</h2>

        {['name', 'age', 'gender', 'phone', 'address', 'bloodGroup', 'emergencyContact'].map(field => (
          <div key={field} className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 capitalize">
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type={(field === 'age' || field === 'phone' || field === 'emergencyContact') ? 'number' : 'text'}
              name={field}
              value={patient[field]}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>
        ))}

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
          Register Patient
        </button>
      </form>
    </div>
  );
}

export default App;
