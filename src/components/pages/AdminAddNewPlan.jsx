import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = "https://backend-q0wc.onrender.com/api/admin/plans";
// import AddNewPlan from ''
import AddNewPlan from "../admin/AddPlanForm";
const CONFIG_URL = "https://backend-q0wc.onrender.com/api/admin/configurations";

export default function AdminAddNewPlan() {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [config, setConfig] = useState({}); // new state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: 0,
        duration: 0,
        video_call_limit: 0,
        people_search_limit: 0,
        people_message_limit: 0,
        audio_call_limit: 0,
        type: "",
        billing_info: "",
    });
    const [editingId, setEditingId] = useState(null);

    const fetchPlans = async () => {
        const res = await axios.get(BASE_URL);
        setPlans(res.data);
    };
     
    const fetchConfig = async () => {
        try {
            const res = await axios.get(CONFIG_URL);
            setConfig(res.data);
        } catch (err) {
            console.error("Error fetching configuration:", err);
        }
    };


    useEffect(() => {
        fetchPlans();
        fetchConfig();
    }, []);
        
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

       try {
            console.log("formDate: ", formData)
            if (!editingId) {
                await axios.post(BASE_URL, formData);
            } else {

                await axios.put(`${BASE_URL}/${editingId}`, formData);
            }

            setFormData({
                name: "",
                description: "",
                price: 0,
                duration: 0,
                video_call_limit: 0,
                people_search_limit: 0,
                people_message_limit: 0,
                audio_call_limit: 0,
                type: "",
                billing_info: "",
            });

            navigate("/admin-dashboard");
            fetchPlans();
        } catch (err) {
            console.error("Error saving plan:", err);
        }
    };

    return (
        <>
            <AddNewPlan
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                editingId={editingId}
                setEditingId={setEditingId}
                formData={formData}
                config={config} //  pass config to form
            />
        </>
    )
}