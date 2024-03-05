import type { Client } from "../types.ts";
interface ClientsProps {
  clients: Client[];
}
export default function Clients(props: ClientsProps) {
  function handleClick(id: number) {
    window.location.href = `/client/${id.toString()}`;
  }
  return (
    // create a table to display the clients using tailwindcss
    <table className="min-w-full">
      <thead>
        <tr>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            ID
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Company Name
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Domain
          </th>
          <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Virtual Path
          </th>
        </tr>
      </thead>
      <tbody>
        {props.clients.map((client, index: number) => (
          <tr
            className="cursor-pointer transition-colors duration-300 hover:bg-gray-200"
            key={index}
            onClick={() => handleClick(client.Config_ID)}
          >
            <td className="px-6 py-4 whitespace-nowrap">{client.Config_ID}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {client.CompanyName_VC}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {client.UseDomain_VC}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {client.VirtualPath_VC}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
