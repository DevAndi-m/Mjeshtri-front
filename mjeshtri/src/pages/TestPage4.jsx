import { useEffect, useState } from 'react'

function TestPage4() {
    const [lecturerName, setLecturerName] = useState("");
    const [department, setDepartment] = useState("");
    const [email, setEmail] = useState("");

    const [lectureName, setLectureName] = useState("");
    const [lecturerId, setLecturerId] = useState("");

    const [lecturers, setLecturers] = useState([]);

    const [editingLecturer, setEditingLecturer] = useState(null);
    const [editLecturerName, setEditLecturerName] = useState("");
    const [editDepartment, setEditDepartment] = useState("");
    const [editEmail, setEditEmail] = useState("");

    const fetchLecturers = async () => {
        const res = await fetch("http://localhost:5142/api/exam3/get-lecturers");
        const data = await res.json();
        setLecturers(data);
    };

    useEffect(() => {
        fetchLecturers();
    }, []);

    const handleCreateLecturer = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5142/api/exam3/create-lecturer", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lecturerName, department, email })
        });
        const data = await res.json();
        alert(data.message);
        fetchLecturers();
    };

    const handleCreateLecture = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5142/api/exam3/create-lecture", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lectureName, lecturerId: Number(lecturerId) })
        });
        const data = await res.json();
        alert(data.message);
        fetchLecturers();
    };

    const handleEdit = (lecturer) => {
        setEditingLecturer(lecturer);
        setEditLecturerName(lecturer.lecturerName);
        setEditDepartment(lecturer.department);
        setEditEmail(lecturer.email);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5142/api/exam3/update-lecturer", {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lecturerId: editingLecturer.lecturerId,
                lecturerName: editLecturerName,
                department: editDepartment,
                email: editEmail
            })
        });
        const data = await res.json();
        alert(data.message);
        setEditingLecturer(null);
        fetchLecturers();
    };

    const handleDeleteLecture = async (lectureId) => {
        const res = await fetch(`http://localhost:5142/api/exam3/delete-lecture/${lectureId}`, {
            method: "DELETE"
        });
        const data = await res.json();
        alert(data.message);
        fetchLecturers();
    };

    return (
        <div className='bg-slate-50 min-h-screen py-8 px-4'>

            <div className='flex flex-col'>
                <h1 className='text-center text-2xl font-bold text-gray-700 mb-2'>Create Lecturer</h1>
                <form onSubmit={handleCreateLecturer} className='flex flex-col gap-3 w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md'>
                    <input type='text' placeholder='Lecturer Name' value={lecturerName} onChange={(e) => setLecturerName(e.target.value)} required
                        className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' />
                    <input type='text' placeholder='Department' value={department} onChange={(e) => setDepartment(e.target.value)} required
                        className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' />
                    <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required
                        className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' />
                    <input type='submit' value='Create Lecturer' className='bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-2 rounded-lg font-semibold transition-colors' />
                </form>
            </div>

            <div className='flex flex-col mt-10'>
                <h1 className='text-center text-2xl font-bold text-gray-700 mb-2'>Create Lecture</h1>
                <form onSubmit={handleCreateLecture} className='flex flex-col gap-3 w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md'>
                    <input type='text' placeholder='Lecture Name' value={lectureName} onChange={(e) => setLectureName(e.target.value)} required
                        className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400' />
                    <select value={lecturerId} onChange={(e) => setLecturerId(e.target.value)} required
                        className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white'>
                        <option value="">Select Lecturer</option>
                        {lecturers.map(l => (
                            <option key={l.lecturerId} value={l.lecturerId}>{l.lecturerName}</option>
                        ))}
                    </select>
                    <input type='submit' value='Create Lecture' className='bg-green-600 hover:bg-green-700 cursor-pointer text-white py-2 rounded-lg font-semibold transition-colors' />
                </form>
            </div>

            <div className='flex flex-col mt-10 mb-12'>
                <h1 className='text-center text-2xl font-bold text-gray-700 mb-2'>Lecturers & Lectures <span className='text-base font-normal text-gray-400'>({lecturers.length})</span></h1>
                <div className='w-full max-w-5xl mx-auto rounded-xl shadow-md overflow-hidden'>
                    <table className='w-full bg-white'>
                        <thead>
                            <tr className='bg-blue-600 text-white'>
                                <th className='px-6 py-3 text-left font-semibold'>Lecturer Name</th>
                                <th className='px-6 py-3 text-left font-semibold'>Department</th>
                                <th className='px-6 py-3 text-left font-semibold'>Email</th>
                                <th className='px-6 py-3 text-left font-semibold'>Lectures</th>
                                <th className='px-6 py-3 text-center font-semibold'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lecturers.map(l => (
                                <tr key={l.lecturerId} className='border-t border-gray-100 hover:bg-slate-50'>
                                    <td className='px-6 py-3 font-medium'>{l.lecturerName}</td>
                                    <td className='px-6 py-3 text-gray-600'>{l.department}</td>
                                    <td className='px-6 py-3 text-gray-600'>{l.email}</td>
                                    <td className='px-6 py-3'>
                                        {l.lectures.length === 0 ? (
                                            <span className='text-gray-400 text-sm italic'>No lectures</span>
                                        ) : (
                                            l.lectures.map(lec => (
                                                <div key={lec.lectureId} className='flex justify-between items-center gap-2 mb-1'>
                                                    <span className='text-sm'>{lec.lectureName}</span>
                                                    <button onClick={() => handleDeleteLecture(lec.lectureId)} className='bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded-md cursor-pointer transition-colors'>Delete</button>
                                                </div>
                                            ))
                                        )}
                                    </td>
                                    <td className='px-6 py-3 text-center'>
                                        <button onClick={() => handleEdit(l)} className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md cursor-pointer transition-colors text-sm'>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {editingLecturer && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-8 w-full max-w-sm rounded-xl shadow-xl">
                        <h2 className="text-center text-xl font-bold text-gray-700 mb-4">Edit Lecturer</h2>
                        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                            <input type="text" value={editLecturerName} onChange={(e) => setEditLecturerName(e.target.value)} placeholder="Lecturer Name"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <input type="text" value={editDepartment} onChange={(e) => setEditDepartment(e.target.value)} placeholder="Department"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="Email"
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer">Save</button>
                            <button type="button" onClick={() => setEditingLecturer(null)} className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold transition-colors cursor-pointer">Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TestPage4;
