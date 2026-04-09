import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  label: string;
  theme?: 'primary' | 'primaryConnexion' | 'secondary';
  onPress?: () => void;
};

export default function Button({ label, theme, onPress}: Props) {
  if (theme === 'primary') {
      return (
        <View style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18},
        ]}>
          <Pressable
            style={[styles.button, {backgroundColor: '#fff'}]}
            onPress={onPress}>
              <FontAwesome name="picture-o" size={18} color="#25292e" style={styles.buttonIcon} />
              <Text style={[ styles.buttonLabel, {color: '#25292e'}]}>{label}</Text>
            </Pressable>
        </View>
      );
  }

  if (theme === 'primaryConnexion') {
      return (
        <View style={[
          styles.buttonContainer,
          { borderWidth: 4, borderColor: '#ffd33d', borderRadius: 18},
        ]}>
          <Pressable
            style={[styles.button, {backgroundColor: '#fff'}]}
            onPress={onPress}>
              <Text style={[ styles.buttonLabel, {color: '#25292e'}]}>{label}</Text>
            </Pressable>
        </View>
      );
  }

  if (theme === 'secondary') {
      return (
        <View style={[
          styles.buttonContainerSecondary,
          { borderWidth: 2, borderColor: '#ffd33d', borderRadius: 10, marginTop: 10},
        ]}>
          <Pressable
            style={[styles.buttonSecondary, {backgroundColor: '#fff'}]}
            onPress={onPress}>
              <Text style={[ styles.buttonLabelSecondary, {color: '#25292e'}]}>{label}</Text>
            </Pressable>
        </View>
      );
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon:{
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
  buttonContainerSecondary: {
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  buttonSecondary: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonLabelSecondary: {
    color: '#fff',
    fontSize: 14,
  },
});