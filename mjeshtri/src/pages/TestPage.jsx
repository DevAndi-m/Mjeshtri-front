import React, { useEffect, useState } from 'react'

function TestPage() {
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
            const response = await fetch("http://localhost:5142/api/exam/get-satellites");
            const data = await response.json();
            setSatellites(data);
        };
        fetchSatellites();
    }, []);

    // Get parents for dropdown
    useEffect(() => {
        const fetchPlanets = async () => {
            const response = await fetch("http://localhost:5142/api/exam/get-planets");
            const data = await response.json();
            setPlanets(data);
        };
        fetchPlanets();
    }, []);

    // Create Child
    const handleCreateSatellite = async () => {

        const response = await fetch("http://localhost:5142/api/exam/create-satellite", {
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
        const response = await fetch("http://localhost:5142/api/exam/create-planet" , {
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
        const res = await fetch(`http://localhost:5142/api/exam/delete-satellite/${satellite.satelliteId}`, {
            method: "DELETE"
        });
        const data = await res.json();
        alert(data.message || "Satellite deleted successfully!");
    }

    const handleUpdate = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5142/api/exam/update-satelite", {
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
    <div className='bg-gray-100 min-h-screen'>
        <div className='flex flex-col'>
            <h1 className='text-center'>Create Planet</h1>
            <form onSubmit={handleSubmit} className='flex flex-col space-y-4 w-full max-w-sm mx-auto mt-8 bg-white p-6 '>    
                <input type='text' name='name' placeholder='Planet Name' value={name} onChange={(e) => setName(e.target.value)} required />
                <input type='text' name='type' placeholder='Planet Type' value={type} onChange={(e) => setType(e.target.value)} required />
                <input type='submit' value='Create Planet' className='bg-blue-500 cursor-pointer text-white p-4'/>
            </form>
        </div>

        <div className='flex flex-col'>
            <h1 className='text-center'>Create Satellite</h1>

            <form onSubmit={handleCreateSatellite} className='flex flex-col space-y-4 w-full max-w-sm mx-auto mt-8 bg-white p-6'>
                <input type='text' name='sName' placeholder='Satellite Name' value={sName} onChange={(e) => setSName(e.target.value)} required />
                <select name='sPlanetId' className='bg-black text-white' value={sPlanetId} onChange={(e) => setSPlanetId(e.target.value)} required>
                    <option value="">Select Planet</option>
                    {planets.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <input type='submit' value='Create Satellite' className='bg-green-500 cursor-pointer text-white p-4'/>
            </form>
        </div>

        
        <div className='flex flex-col mb-12'>
            <h1 className='text-center'>GET SATELLITES total: {satellites.length} satellites created</h1>
            <table className='w-full max-w-2xl mx-auto mt-8 bg-white '>
                <thead>
                    <tr>
                        <th className='border px-4 py-2'>Satellite Name</th>
                        <th className='border px-4 py-2'>Planet Name</th>
                        <th className='border px-4 py-2'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {satellites.map(s => (
                        <tr key={s.satelliteId}>
                            <td className='border px-4 py-2'>{s.name}</td>
                            <td className='border px-4 py-2'>{s.planetName}</td>
                            <td className='border px-4 py-2 justify-center gap-3 flex'>
                                <button onClick={() => handleDelete(s)} className='bg-red-500 cursor-pointer text-white p-2'>Delete</button>
                                <button onClick={() => handleEdit(s)} className='bg-blue-500 cursor-pointer text-white p-2'>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {editingSatellite && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center">
            <div className="bg-white p-6 w-full max-w-sm">
                
                <h2 className="text-center mb-4">Edit Satellite</h2>

                <form onSubmit={handleUpdate} className="flex flex-col gap-3">

                    <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="border p-2"
                    />

                    <select
                        value={editPlanetId}
                        onChange={(e) => setEditPlanetId(e.target.value)}
                        className="border p-2"
                    >
                        {planets.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>

                    <button className="bg-green-500 text-white p-2">
                        Save
                    </button>

                    <button
                        type="button"
                        onClick={() => setEditingSatellite(null)}
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

export default TestPage
