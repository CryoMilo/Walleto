import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
	return (
		<View style={style.container}>
			<Text style={style.heading}>How about No</Text>
			<Link href={"/about"}>About</Link>

			<Image
				source={require("@/assets/images/myanmar_hero.png")}
				style={{ width: "100%", height: "100%" }}
			/>
		</View>
	);
}

const style = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "pink",
		borderRadius: 20,
	},

	heading: {
		fontFamily: "serif",
	},
});
