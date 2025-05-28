import ProfileCard from "@/components/ProfileCard";
import { View } from "react-native";
const Index = () => {
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
