import Admin from "../../models/Admins.js";

export const getAllAdmin = async (req, res) => {
  try {
    const { search } = req.query;

    // Create a query object to build the MongoDB query based on conditions
    let query = {};
    
    if (search && search.trim() !== "") {

      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }



    // Fetch admins based on query conditions and pagination
    const admins = await Admin.find(query)
      .select("id username name email role branch")
      .sort({ createdAt: -1 });


    return res.status(200).json({
      success: true,
      message: "Found admins",
      data: admins,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message,
      details: err,
      function: "getAllAdmin",
      success: false,
    });
  }
};

export const getAdminById = async (req, res) => {
  try {
    const { id } = req.query;
    const admin = await Admin.findById(id)
      .populate("role")
      .select("id username name email role phone");

    console.log(admin);

    return res.status(200).json({
      success: true,
      message: "Found admin",
      data: admin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      details: error,
      function: "getAdminById",
      success: false,
    });
  }
};
