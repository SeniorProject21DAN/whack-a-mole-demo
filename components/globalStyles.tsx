import { StyleSheet } from 'react-native';

// const PRIMARY_COLOR = "#0C8B99"
// const SECONDARY_COLOR = "#1697A6"
// const FOURTH_COLOR = "#12B2C4"
// const TERTIARY_COLOR = "#C41704"
// const FIFTH_COLOR = "#43D1E0"

const PRIMARY_COLOR = "#0F5E50"
const SECONDARY_COLOR = "#427DB8"
const TERTIARY_COLOR = "#318CB0"
const FOURTH_COLOR = "#5CB8B1"
const FIFTH_COLOR = "#51FCC9"

export const globalStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "space-evenly"
    },
    headerContainer: {
        flex: 1,
        backgroundColor: PRIMARY_COLOR,
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "row",
    },
    homeHeaderContainer: {
        flex: 1,
        backgroundColor: PRIMARY_COLOR,
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 20,
        alignSelf: "center",
        justifyContent: "center",
        color: "white",
    },
    connectedPlayersContainer: {
        flex: 3,
        flexDirection: "row",
        flexWrap: "wrap",
        backgroundColor: SECONDARY_COLOR,
        alignItems: "center",
    },
    calibrationContainer: {
        flex: 3,
        backgroundColor: FOURTH_COLOR,
        flexDirection: "column",
        justifyContent: "space-evenly"
    },
    calibrateRows: {
        flex: 1,
        backgroundColor: FOURTH_COLOR,
        flexDirection: "row",
    },
    calibrationButtons: {
        flex: 1,
        flexDirection: "row",
        borderRadius: 4,
        backgroundColor: FIFTH_COLOR,
        // alignSelf: "stretch",
        // alignContent: "center",
        alignItems: "center",
        margin: 20,
        paddingStart: "15%"
    },
    backButton: {
        borderRadius: 75,
        margin: 20,
        alignSelf: "center"
    },
    playersListItems: {
        backgroundColor: FOURTH_COLOR,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        height: 55,
        margin: 5,
        flex: 1,
    },
    playersListText: {
        margin: 10,
        color: "white"
    },
    textInput: {
        flexDirection: "row",
        padding: 4,
        paddingHorizontal: "25%",
        backgroundColor: "white",
        alignSelf: "stretch",
        textAlign: "center",
        borderRadius: 5,
    },
    headerSubContainer: {
        flexDirection: "column",
        borderRadius: 5,
        padding: 2,
        backgroundColor: PRIMARY_COLOR,
        alignSelf: "stretch",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    iconStyle: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "purple",
    },
    sidesContainer: {
        flex: 2,
        alignSelf: "stretch",
        flexDirection: "row",
    },
    buttons: {
        flex: 1
    },
    buttonContent: {
        flex: 1,
        alignItems: "center",
    },
    calibrationButtonExtra: {
        backgroundColor: TERTIARY_COLOR,
        position: "absolute",
        alignSelf: "center",
        alignContent: "center",
        padding: "3%",
        zIndex: 1,
        top: "43%",
        borderRadius: 30,
    },
    controllerContainer: {
        flex: 5,
        backgroundColor: FOURTH_COLOR,
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    controllerContainerCol: {
        flex: 1,
        backgroundColor: FOURTH_COLOR,
        flexDirection: "column",
        justifyContent: "space-evenly"
    },
});