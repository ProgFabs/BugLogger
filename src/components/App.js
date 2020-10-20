import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import AddLogItem from "./AddLogItem";
import LogItem from "./LogItem";
import Alert from "react-bootstrap/Alert";
import { ipcRenderer } from "electron";

const App = () => {
	const [logs, setLogs] = useState([]);
	const [alert, setAlert] = useState({ show: false, message: "", variant: "success" });

	useEffect(() => {
		ipcRenderer.send('logs:load');

		ipcRenderer.on('logs:get', (e, logs) => {
			setLogs(JSON.parse(logs));
		})

		ipcRenderer.on('logs:clear', () => {
			setLogs([]);
			showAlert("Logs cleared!");
		})
	}, [])

	const addLogItem = (text, priority, user) => {
		if(!text || !priority || !user) {
			showAlert("Please enter all fields!", "danger")
		} else {
			const newLog = {
				text,
				priority,
				user,
				created: Date.now()
			};

			// setLogs([...logs, newLog]);

			ipcRenderer.send('logs:add', newLog)

			showAlert('Log added!')
		}
	}

	const deleteLogItem = (_id) => {
		// setLogs(logs.filter((log) => log._id !== _id));
		ipcRenderer.send('logs:delete', _id); 
		showAlert('Log removed!', 'danger')
	}

	const showAlert = (message, variant = 'success', seconds = 3000) => {
		setAlert({ 
			show: true, 
			message,
			variant,
		});

		setTimeout(() => {
			setAlert({
				show: false,
				message: "",
				variant: "success"
			})
		}, seconds)
	}

	return (
		<Container>
			<AddLogItem addLogItem={addLogItem} />
			{alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
			<Table>
				<thead>
					<tr>
						<th>Priority</th>
						<th>Log Text</th>
						<th>User</th>
						<th>Created</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{logs.map((log) => {
						return(
						<LogItem key={log._id} log={log} deleteLogItem={deleteLogItem}/>
						)
					})}
				</tbody>
			</Table>
		</Container>
	)
}

export default App
