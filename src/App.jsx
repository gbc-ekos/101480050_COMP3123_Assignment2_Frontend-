import Shell from "./components/shell/Shell";
import { Routes, Route } from 'react-router-dom';
import Signup from "./components/routes/Signup";
import Login from "./components/routes/Login";
import Employees from "./components/routes/employee/Employees";

export default function App() {
    return (
        <Shell>
            <Routes>
                <Route path="/" element={<Employees/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        </Shell>
    );
}
