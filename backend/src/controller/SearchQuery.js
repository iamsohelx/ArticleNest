import client from "../config/tavily.js";
export async function SearchQuery(req, res) {
  try {
    const {query} = req.body;
    console.log("server : ", query);
    
    const response = await client.search(query);
    res.status(200).send(response);
  } catch (error) {
    console.log("Something Went Wrong");
    res.status(500).json({message:"Something went wrong"})
  }
}
