import React, { useEffect, useState } from 'react'

function TestPage2() {
    // rerender when creating/deleting/editing
    const [refresh, setRefresh] = useState(false);

    // create parent
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");

    // create satellite
    const [cName, setCName] = useState("");
    const [cDescription, setCDescription] = useState("");
    const [cEmployeeId, setCEmployeeId] = useState("");

    // fetchEmployees
    const [employees, setEmployees] = useState([]);

    // fetchSatellites
    const [contracts, setContracts] = useState([]);

    // edit satellite
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [editName, setEditName] = useState("");
    const [editSurname, setEditSurname] = useState("");

    // get children for table
    useEffect(() => {
        const fetchContracts = async () => {
            const response = await fetch("http://localhost:5142/api/exam1/get-contracts");
            const data = await response.json();
            setContracts(data);
        };
        fetchContracts();
    }, [refresh]);

    // Get parents for dropdown
    useEffect(() => {
        const fetchEmployees = async () => {
            const response = await fetch("http://localhost:5142/api/exam1/get-employees");
            const data = await response.json();
            setEmployees(data);
        };
        fetchEmployees();
    }, [refresh]);

    // Create Child
    const handleCreateContract  = async (e) => {

        e.preventDefault();

        const response = await fetch("http://localhost:5142/api/exam1/create-contract", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: cName, description: cDescription, employeeId: cEmployeeId })
        });

        const data = await response.json();
        alert(data.message || "Contract created successfully!");

        setCName("");
        setCDescription("");
        setCEmployeeId("");

        setRefresh(!refresh);
    };


    // create parent
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5142/api/exam1/create-employee" , {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, surname })
        })

        const data = await response.json();
        
        alert(data.message || "Employee created successfully!");

        setName("");
        setSurname("");

        setRefresh(!refresh);
    }

    // Edit child
    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setEditName(employee.name);
        setEditSurname(employee.surname);
    };

    // Delete Child
    const handleDelete = async (contract) => {
        const res = await fetch(`http://localhost:5142/api/exam1/delete-contract/${contract.id}`, {
            method: "DELETE"
        });
        const data = await res.json();
        alert(data.message || "Contract deleted successfully!");

        setRefresh(!refresh);
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        const response = await fetch(`http://localhost:5142/api/exam1/update-employee`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: editingEmployee.id,
                name: editName,
                surname: editSurname
            })
        }); 

        const data = await response.json();
        alert(data.message || "Employee updated successfully!");
        setEditingEmployee(null);

        setRefresh(!refresh);
    }

  return (
    <div className='bg-gray-100 min-h-screen'>
        <div className='flex flex-col'>
            <h1 className='text-center'>Create Employee</h1>
            <form onSubmit={handleSubmit} className='flex flex-col space-y-4 w-full max-w-sm mx-auto mt-8 bg-white p-6 '>    
                <input type='text' name='name' placeholder='Employee Name' value={name} onChange={(e) => setName(e.target.value)} required />
                <input type='text' name='surname' placeholder='Employee Surname' value={surname} onChange={(e) => setSurname(e.target.value)} required />
                <input type='submit' value='Create Employee' className='bg-blue-500 cursor-pointer text-white p-4'/>
            </form>
        </div>

        <div className='flex flex-col'>
            <h1 className='text-center'>Create Contract</h1>

            <form onSubmit={handleCreateContract} className='flex flex-col space-y-4 w-full max-w-sm mx-auto mt-8 bg-white p-6'>
                <input type='text' name='cName' placeholder='Contract Name' value={cName} onChange={(e) => setCName(e.target.value)} required />
                <input type='text' name='cDescription' placeholder='Contract Description' value={cDescription} onChange={(e) => setCDescription(e.target.value)} required />
                <select name='cEmployeeId' className='bg-black text-white' value={cEmployeeId} onChange={(e) => setCEmployeeId(e.target.value)} required>
                    <option value="">Select Employee</option>
                    {employees.map(e => (
                        <option key={e.id} value={e.id}>{e.name} {e.surname}</option>
                    ))}
                </select>
                <input type='submit' value='Create Contract' className='bg-green-500 cursor-pointer text-white p-4'/>
            </form>
        </div>

        
        <div className='flex flex-col mb-12'>
            <h1 className='text-center'>GET contracts total: {contracts.length} contracts created</h1>
            <table className='w-full max-w-2xl mx-auto mt-8 bg-white '>
                <thead>
                    <tr>
                        <th className='border px-4 py-2'>Contract Title</th>
                        <th className='border px-4 py-2'>Contract Description</th>
                        <th className='border px-4 py-2'>Employee Name</th>
                        <th className='border px-4 py-2'>Employee Surname</th>
                        <th className='border px-4 py-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {contracts.map(c => (
                        <tr key={c.id}>
                            <td className='border px-4 py-2'>{c.title}</td>
                            <td className='border px-4 py-2'>{c.description}</td>
                            <td className='border px-4 py-2'>{c.employeeName}</td>
                            <td className='border px-4 py-2'>{c.employeeSurname}</td>
                            <td className='border px-4 py-2 justify-center gap-3 flex'>
                                <button onClick={() => handleDelete(c)} className='bg-red-500 cursor-pointer text-white p-2'>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className='flex flex-col mb-12'>
            <h1 className='text-center'>GET employees total: {employees.length} employees created</h1>
            <table className='w-full max-w-2xl mx-auto mt-8 bg-white '>
                <thead>
                    <tr>
                        <th className='border px-4 py-2'>Employee ID</th>
                        <th className='border px-4 py-2'>Employee Name</th>
                        <th className='border px-4 py-2'>Employee Surname</th>
                        <th className='border px-4 py-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(e => (
                        <tr key={e.id}>
                            <td className='border px-4 py-2'>{e.id}</td>
                            <td className='border px-4 py-2'>{e.name}</td>
                            <td className='border px-4 py-2'>{e.surname}</td>
                            <td className='border px-4 py-2 justify-center gap-3 flex'>
                                <button onClick={() => handleEdit(e)} className='bg-blue-500 cursor-pointer text-white p-2'>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {editingEmployee && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 w-full max-w-sm">
                
                <h2 className="text-center mb-4">Edit Employee info</h2>

                <form onSubmit={handleUpdate} className="flex flex-col gap-3">

                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border p-2"
                    />

                    <input 
                        type="text"
                        value={editSurname}
                        onChange={(e) => setEditSurname(e.target.value)}
                        className="border p-2"
                    />

                    <button type="submit" className="bg-green-500 text-white p-2">
                        Save
                    </button>

                    <button
                        type="button"
                        onClick={() => setEditingEmployee(null)}
                        className="bg-gray-400 text-white p-2"
                    >
                        Cancel
                    </button>

                </form>
            </div>
        </div>
    )}
    </div>
  )
}

export default TestPage2
