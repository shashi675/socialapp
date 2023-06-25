// import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
// import { createContext, useContext } from "react";
// import { AuthContext } from "./authContext";
// import axios from "axios";


// export const FollowerContext = createContext();

// export const FollowerContextProvider = ({ children }) => {

//     const { currentUser } = useContext(AuthContext);

//     const [followers, following, unFollowers] = useQueries({
//         queries: [
//           {
//             queryKey: ['followers'],
//             queryFn: async () => 
//               await axios.get("http://localhost:3001/api/follower/getMyFollowersDetails?token="+currentUser.token)
//                 .then((res) => {
//                     // setMyFollowers(res.data);
//                     return res.data;
//                 })

//           },
//           {
//             queryKey: ['following'],
//             queryFn: async () => 
//               await axios.get("http://localhost:3001/api/follower?token="+currentUser.token)
//                 .then((res) => {
//                     // setMeFollowing(res.data);
//                     return res.data;
//                 })
//           },
//         ]
//       });

//       const queryClient = useQueryClient();

//       const mutationFollowers = useMutation(async () => {
//         return await axios.get("http://localhost:3001/api/follower/getMyFollowersDetails?token="+currentUser.token);
//       }, {
//         onSuccess: () => {
//             // invalidate and refetch:
//           queryClient.invalidateQueries("followers");
//         }
//       })

//       const mutationFollowing = useMutation(async () => {
//         return await axios.get("http://localhost:3001/api/follower?token="+currentUser.token);
//       }, {
//         onSuccess: () => {
//             // invalidate and refetch:
//           queryClient.invalidateQueries("followers");
//         }
//       })
    

//       return (
//         <FollowerContext.Provider value = {{ followers, following, mutationFollowers, mutationFollowing }} >
//             {children}
//         </FollowerContext.Provider>
//       )

// };