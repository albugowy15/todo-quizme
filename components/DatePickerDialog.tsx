import * as React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import DateTimePicker, { type DateType } from "react-native-ui-datepicker";
import dayjs from "dayjs";
import { Dialog } from "@rneui/themed";

const theme = { mainColor: "#0047FF", activeTextColor: "#fff" };

const DatePickerDialog = ({
  deadline,
  setDeadline,
  visible,
  setVisible,
}: {
  visible: boolean;
  deadline: DateType | undefined;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setDeadline: React.Dispatch<React.SetStateAction<DateType | undefined>>;
}) => {
  return (
    <Dialog isVisible={visible} onBackdropPress={() => setVisible(false)}>
      <View style={styles.datePickerContainer}>
        <View style={styles.datePicker}>
          <DateTimePicker
            mode="single"
            date={deadline}
            locale={"en"}
            displayFullDays
            onChange={(params) => setDeadline(params.date)}
            timePicker={true}
            headerButtonColor={theme?.mainColor}
            selectedItemColor={theme?.mainColor}
            selectedTextStyle={{
              fontWeight: "bold",
              color: theme?.activeTextColor,
            }}
            todayContainerStyle={{
              borderWidth: 1,
            }}
          />
          <View style={styles.footer}>
            <View style={styles.footerContainer}>
              <Text>
                {deadline
                  ? dayjs(deadline)
                      .locale("en")
                      .format("MMMM, DD, YYYY - HH:mm")
                  : "..."}
              </Text>
              <Button title="Confirm" onPress={() => setVisible(false)} />
            </View>
          </View>
        </View>
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  datePickerContainer: {
    alignItems: "center",
  },
  datePicker: {
    backgroundColor: "#fff",
    shadowColor: "#000",
  },
  footer: {},
  footerContainer: {
    gap: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
});
export default DatePickerDialog;
