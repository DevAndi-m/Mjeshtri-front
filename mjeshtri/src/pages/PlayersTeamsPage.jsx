import { useState, useEffect } from "react";
import { createTeam, createPlayer, getPlayers, deletePlayer, updatePlayer } from "../playerService";

const PlayersTeamsPage = () => {
  const [players, setPlayers] = useState([]);
  const [teamForm, setTeamForm] = useState({ TeamId: "", Name: "" });
  const [playerForm, setPlayerForm] = useState({ PlayerId: "", Name: "", Number: "", BirthYear: "", TeamId: "" });
  const [editingPlayer, setEditingPlayer] = useState(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const data = await getPlayers();
      setPlayers(data);
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await createTeam(teamForm);
      setTeamForm({ TeamId: "", Name: "" });
      alert("Team created successfully");
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  const handleCreatePlayer = async (e) => {
    e.preventDefault();
    try {
      await createPlayer(playerForm);
      setPlayerForm({ PlayerId: "", Name: "", Number: "", BirthYear: "", TeamId: "" });
      fetchPlayers();
    } catch (error) {
      console.error("Error creating player:", error);
    }
  };

  const handleDeletePlayer = async (id) => {
    try {
      await deletePlayer(id);
      fetchPlayers();
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };

  const handleEditPlayer = (player) => {
    setEditingPlayer(player);
    setPlayerForm({
      PlayerId: player.playerId,
      Name: player.name,
      Number: player.number,
      BirthYear: player.birthYear,
      TeamId: player.teamId || "",
    });
  };

  const handleUpdatePlayer = async (e) => {
    e.preventDefault();
    try {
      await updatePlayer(playerForm);
      setEditingPlayer(null);
      setPlayerForm({ PlayerId: "", Name: "", Number: "", BirthYear: "", TeamId: "" });
      fetchPlayers();
    } catch (error) {
      console.error("Error updating player:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Players & Teams Management</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Create Team Form */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create Team</h2>
          <form onSubmit={handleCreateTeam} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Team ID</label>
              <input
                type="number"
                value={teamForm.TeamId}
                onChange={(e) => setTeamForm({ ...teamForm, TeamId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={teamForm.Name}
                onChange={(e) => setTeamForm({ ...teamForm, Name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Team
            </button>
          </form>
        </div>

        {/* Create/Update Player Form */}
        <div className="rounded-lg border border-gray-300 bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingPlayer ? "Update Player" : "Create Player"}
          </h2>
          <form onSubmit={editingPlayer ? handleUpdatePlayer : handleCreatePlayer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Player ID</label>
              <input
                type="number"
                value={playerForm.PlayerId}
                onChange={(e) => setPlayerForm({ ...playerForm, PlayerId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={playerForm.Name}
                onChange={(e) => setPlayerForm({ ...playerForm, Name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Number</label>
              <input
                type="number"
                value={playerForm.Number}
                onChange={(e) => setPlayerForm({ ...playerForm, Number: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Birth Year</label>
              <input
                type="number"
                value={playerForm.BirthYear}
                onChange={(e) => setPlayerForm({ ...playerForm, BirthYear: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Team ID</label>
              <input
                type="number"
                value={playerForm.TeamId}
                onChange={(e) => setPlayerForm({ ...playerForm, TeamId: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingPlayer ? "Update Player" : "Create Player"}
            </button>
            {editingPlayer && (
              <button
                type="button"
                onClick={() => {
                  setEditingPlayer(null);
                  setPlayerForm({ PlayerId: "", Name: "", Number: "", BirthYear: "", TeamId: "" });
                }}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 mt-2"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Players List */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Players List</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {players.map((player) => (
              <li key={player.playerId} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{player.name}</p>
                    <p className="text-sm text-gray-500">ID: {player.playerId}, Number: {player.number}, Birth Year: {player.birthYear}, Team: {player.teamName}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPlayer(player)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlayer(player.playerId)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlayersTeamsPage;