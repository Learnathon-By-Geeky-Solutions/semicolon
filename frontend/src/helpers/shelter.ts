import axios from "axios"

export const storeShelterLocations = async ( locationArray ) => {
    console.log("api comm reached")
    const res = await axios.post("http://localhost:5000/api/authority_user/shelters/save", {locationArray});
    if(res.status !== 200)
    {
        throw new Error("Unable to save shelter locations");
    }
    const data = await res.data;
    return data;
};

export const getShelterLocations = async () => {
    const res = await axios.get("http://localhost:5000/api/authority_user/shelters/get");
     //const res = "hi";
     if (res.status === 200) {
        const data = await res.data;
        console.log(data)
        //return "hiii , how can";
        return data;
     }
     else if(res.status === 401){
        console.log("no schema found")
        return ([]);
     }
     else{
        throw new Error("Unable to send chat");
     }
     
};