import supabase from "../config/client.js"; 
export const getSettings = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("settings") 
      .select("*")      
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json({ settings: data });
  } catch (err) {
    return res.status(500).json({ error: "Server error: " + err.message });
  }
};
