import React, { useEffect, useState } from 'react'

function TestPage3() {
    // create parent
    const [name, setName] = useState("");
    const [type, setType] = useState("");

    // create satellite
    const [sName, setSName] = useState("");
    const [sPlanetId, setSPlanetId] = useState("");

    // fetchPlanets
    const [planets, setPlanets] = useState([]);

    // fetchSatellites
    const [satellites, setSatellites] = useState([]);

    // edit satellite
    const [editingSatellite, setEditingSatellite] = useState(null);
    const [editName, setEditName] = useState("");
    const [editPlanetId, setEditPlanetId] = useState("");

    // get children for table
    useEffect(() => {
        const fetchSatellites = async () => {
            const response = await fetch("http://localhost:5142/api/exam2/get-satellites");
            const data = await response.json();
            setSatellites(data);
        };
        fetchSatellites();
    }, []);

    // Get parents for dropdown
    useEffect(() => {
        const fetchPlanets = async () => {
            const response = await fetch("http://localhost:5142/api/exam2/get-planets");
            const data = await response.json();
            setPlanets(data);
        };
        fetchPlanets();
    }, []);

    // Create Child
    const handleCreateSatellite = async () => {

        const response = await fetch("http://localhost:5142/api/exam2/create-satellite", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: sName, planetId: sPlanetId })
        });

        const data = await response.json();
        alert(data.message || "Satellite created successfully!");
    };


    // create parent
    const handleSubmit = async () => {
        const response = await fetch("http://localhost:5142/api/exam2/create-planet" , {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, type })
        })

        const data = await response.json();

        alert(data.message || "Planet created successfully!");
    }

    // Edit child
    const handleEdit = (satellite) => {
        setEditingSatellite(satellite);
        setEditName(satellite.name);
        setEditPlanetId(satellite.planetId);
    };

    // Delete Child
    const handleDelete = async (satellite) => {
        const res = await fetch(`http://localhost:5142/api/exam2/delete-satellite/${satellite.satelliteId}`, {
            method: "DELETE"
        });
        const data = await res.json();
        alert(data.message || "Satellite deleted successfully!");
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5142/api/exam2/update-satelite", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                satelliteId: editingSatellite.satelliteId,
                name: editName,
                planetId: Number(editPlanetId)
            })
        });

        const data = await response.json();
        alert(data.message || "Satellite updated successfully!");
        setEditingSatellite(null);
    }

  return (
    <div className='bg-slate-50 min-h-screen py-8 px-4'>

        <div className='flex flex-col'>
            <h1 className='text-center text-2xl font-bold text-gray-700 mb-2'>Create Planet</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-3 w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md'>
                <input type='text' name='name' placeholder='Planet Name' value={name} onChange={(e) => setName(e.target.value)} required
                    className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' />
                <input type='text' name='type' placeholder='Planet Type' value={type} onChange={(e) => setType(e.target.value)} required
                    className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400' />
                <input type='submit' value='Create Planet' className='bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-2 rounded-lg font-semibold transition-colors' />
            </form>
        </div>

        <div className='flex flex-col mt-10'>
            <h1 className='text-center text-2xl font-bold text-gray-700 mb-2'>Create Satellite</h1>
            <form onSubmit={handleCreateSatellite} className='flex flex-col gap-3 w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md'>
                <input type='text' name='sName' placeholder='Satellite Name' value={sName} onChange={(e) => setSName(e.target.value)} required
                    className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400' />
                <select name='sPlanetId' value={sPlanetId} onChange={(e) => setSPlanetId(e.target.value)} required
                    className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white'>
                    <option value="">Select Planet</option>
                    {planets.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <input type='submit' value='Create Satellite' className='bg-green-600 hover:bg-green-700 cursor-pointer text-white py-2 rounded-lg font-semibold transition-colors' />
            </form>
        </div>

        <div className='flex flex-col mt-10 mb-12'>
            <h1 className='text-center text-2xl font-bold text-gray-700 mb-2'>Satellites <span className='text-base font-normal text-gray-400'>({satellites.length} total)</span></h1>
            <div className='w-full max-w-2xl mx-auto rounded-xl shadow-md overflow-hidden'>
                <table className='w-full bg-white'>
                    <thead>
                        <tr className='bg-blue-600 text-white'>
                            <th className='px-6 py-3 text-left font-semibold'>Satellite Name</th>
                            <th className='px-6 py-3 text-left font-semibold'>Planet Name</th>
                            <th className='px-6 py-3 text-center font-semibold'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {satellites.map(s => (
                            <tr key={s.satelliteId} className='border-t border-gray-100 hover:bg-slate-50'>
                                <td className='px-6 py-3'>{s.name}</td>
                                <td className='px-6 py-3'>{s.planetName}</td>
                                <td className='px-6 py-3 flex justify-center gap-2'>
                                    <button onClick={() => handleDelete(s)} className='bg-red-500 hover:bg-red-600 cursor-pointer text-white px-3 py-1 rounded-md text-sm transition-colors'>Delete</button>
                                    <button onClick={() => handleEdit(s)} className='bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-3 py-1 rounded-md text-sm transition-colors'>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {editingSatellite && (
            <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
                <div className="bg-white p-8 w-full max-w-sm rounded-xl shadow-xl">
                    <h2 className="text-center text-xl font-bold text-gray-700 mb-4">Edit Satellite</h2>
                    <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <select
                            value={editPlanetId}
                            onChange={(e) => setEditPlanetId(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                        >
                            {planets.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                        <button className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold transition-colors cursor-pointer">
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingSatellite(null)}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg font-semibold transition-colors cursor-pointer"
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

export default TestPage3
