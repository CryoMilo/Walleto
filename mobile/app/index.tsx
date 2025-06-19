import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				backgroundColor: "pink",
			}}>
			<Text>How about No</Text>
			<Link href={"/about"}>About</Link>
		</View>
	);
}
