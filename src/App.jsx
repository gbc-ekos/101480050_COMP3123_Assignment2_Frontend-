import Shell from "./components/shell/Shell";
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from "./components/routes/Signup";
import Login from "./components/routes/Login";
import Employees from "./components/routes/employee/Employees";
import EmployeeForm from "./components/routes/employee/EmployeeForm";

export default function App() {
    return (
        <Shell>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />}/>
                <Route path="/employee" element={<Employees/>}/>
                <Route path="/employee/new" element={<EmployeeForm/>}/>
                <Route path="/employee/:id" element={<EmployeeForm/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </Shell>
    );
}
