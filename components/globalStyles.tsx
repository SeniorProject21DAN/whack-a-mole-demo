import { StyleSheet } from 'react-native';


export const globalStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "space-evenly"
    },
    headerContainer: {
        flex: 1,
        backgroundColor: "brown",
        alignItems: "center",
        // justifyContent: "center",
        flexDirection: "row",

    },
    connectedPlayersContainer: {
        flex: 3,
        backgroundColor: "lightgreen",
        alignItems: "center",
    },
    calibrationContainer: {
        flex: 3,
        backgroundColor: "lightblue",
        // alignItems: "flex-start",
        // flexWrap: "wrap",
        flexDirection: "column",
        justifyContent: "space-evenly"
    },
    calibrateRows: {
        flex: 1,
        backgroundColor: "lightblue",
        flexDirection: "row",
    },
    calibrationButtons: {
        flex: 1,
        backgroundColor: "purple",
        borderRadius: 4,
        alignSelf: "stretch",
        margin: 20,
        alignItems: "center"
    },
    backButton: {
        borderRadius: 75,
        margin: 20,
        // backgroundColor: "black",
        alignSelf: "center"
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 20,
        alignSelf: "center",
        justifyContent: "center",

    },
    sidesText: {

    }
});