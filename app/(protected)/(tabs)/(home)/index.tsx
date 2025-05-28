import ProfileCard from "@/components/ProfileCard";
import { View } from "react-native";

const Index = () => {
  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["profile"],
  //   queryFn: getMyProfile,
  // });

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  // if (error) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text>Error loading profile</Text>
  //     </View>
  //   );
  // }

  return (
    <View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ProfileCard />
      </View>
    </View>
  );
};

export default Index;
