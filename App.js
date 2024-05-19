import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Button = ({
  w = 0, 
  h = null, 
  text = '', 
  backgroundColor = '#22252D',
  textColor = '#eee4e4',
  onPress = () => {}, 
}) => {
  const height = h ?? w;
  return (
      <View style={[styles.buttonContainer, { width: width, height: height }]}>
          <TouchableOpacity 
              style={[styles.button, { backgroundColor: backgroundColor }]}
              onPress={() => onPress(text)}>
                  <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
          </TouchableOpacity>
      </View>
  );
};
const ButtonRow = ({ buttons, buttonContainerWidth, onKeyPress }) => (
  <View style={styles.buttonRow}>
      {buttons.map((btn, idx) => (
          <Button key={idx} w={buttonContainerWidth} {...btn} onPress={onKeyPress} />
      ))}
  </View>
);
const App = () => {
  const buttonContainerWidth = useWindowDimensions().width / 4 - 5;
  const [firstValue, setFirstValue] = useState('');
  const [operator, setOperator] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [clearLabel, setClearLabel] = useState('AC');

  const onKeyPress = key => {
      switch(key) {
          case 'AC':
              setFirstValue('');
              setOperator('');
              setSecondValue('');
              break;
          case '⌫':
              if (secondValue !== '') {
                  setSecondValue(secondValue.slice(0, -1));
              } else if (operator) {
                  setOperator('');
              } else {
                  setFirstValue(firstValue.slice(0, -1));
              }
              setClearLabel('AC');
              break;
          case '%':
              calculate(firstValue, key, secondValue);
              break;
          case '^':
          case '/':
          case '*':
          case '+':
              if (secondValue !== '') {
                  calculate(firstValue, operator, secondValue);
              } else {
                  setOperator(key);
              }
              break;
          case '-':
          case '=':
              calculate(firstValue, operator, secondValue);
              break;
          case '1':
          case '2':
          case '3':
          case '4':
          case '5':
          case '6':
          case '7':
          case '8':
          case '9':
          case '0':
          case '.':
              setClearLabel('C');
              if (operator === '') {
                  setFirstValue( e => `${e}${key}`);
              } else {
                  setSecondValue( e => `${e}${key}`);
              }
          break;
      }
  };

  const calculate = (a = '', o = '', b = '') => {
      let result = 0;

      a = a.replace(',', '.');
      b = b.replace(',', '.');
      
      switch(o) {
          case '%':
              result = parseFloat(a) / 100;
              break;
          case '^':
              result = Math.pow(parseFloat(a), parseFloat(b))
              break;
          case '/':
              result = parseFloat(a) / parseFloat(b);
              break;
          case '*':
              result = parseFloat(a) * parseFloat(b);
              break;
          case '+':
              result = parseFloat(a) + parseFloat(b);
              break;
          case '-':
              result = parseFloat(a) - parseFloat(b);
              break;
      }

      if (result % 1 !== 0) {
          const digitsValue = result.toString().split('.')[1];
          if (digitsValue.length > 6) {
              result = result.toFixed(6);
          }
      }

      result = result.toString().replace('.', ',');

      setFirstValue(result);
      setOperator('');
      setSecondValue('');
  }

  const getDisplayText = () => {
      if (secondValue !== '' ) return secondValue;
      if (firstValue === '') return '0';
      return firstValue;
  }

  return (
  <SafeAreaView>
      <View style={styles.container}>
          <View style={styles.displayContainer}>
              <Text style={styles.displayText}>{getDisplayText()}</Text>
          </View>
          <View style={styles.buttonsContainer}>
              <ButtonRow 
                  buttons={[
                      { text: 'AC', textColor: '#002270' },
                      { text: '^', textColor: '#002270' },
                      { text: '/', textColor: '#002270' },
                      { text: '⌫', textColor: '#002270' }
                  ]}
                  buttonContainerWidth={buttonContainerWidth}
                  onKeyPress={onKeyPress}
              />
              <ButtonRow 
                  buttons={[
                      { text: '7' },
                      { text: '8' },
                      { text: '9' },
                      { text: '*', textColor: '#002270' }
                  ]}
                  buttonContainerWidth={buttonContainerWidth}
                  onKeyPress={onKeyPress}
              />
              <ButtonRow 
                  buttons={[
                      { text: '4' },
                      { text: '5' },
                      { text: '6' },
                      { text: '+', textColor: '#002270' }
                  ]}
                  buttonContainerWidth={buttonContainerWidth}
                  onKeyPress={onKeyPress}
              />
              <ButtonRow 
                  buttons={[
                      { text: '3' },
                      { text: '2' },
                      { text: '1' },
                      { text: '-', textColor: '#002270' }
                  ]}
                  buttonContainerWidth={buttonContainerWidth}
                  onKeyPress={onKeyPress}
              />
              <ButtonRow 
                  buttons={[
                      { text: '0' },
                      { text: '%', textColor: '#002270' },
                      { text: '.', textColor: '#002270' },
                      { text: '=', backgroundColor: '#002270' }
                  ]}
                  buttonContainerWidth={buttonContainerWidth}
                  onKeyPress={onKeyPress}
              />
          </View>
      </View>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
      backgroundColor: '#292d36',
      flex: 1
  },
  displayContainer: {
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      paddingHorizontal: 30
  },
  displayText: {
      fontSize: 75,
      color: '#eee4e4'
  },
  buttonsContainer: {
      paddingHorizontal: 10,
      paddingTop: 10,
      paddingBottom: 30
  },
  buttonRow: {
      flexDirection: 'row'
  },
  buttonContainer: {
      padding: 10
  },
  button: {
      width: '100%',
      height: '100%',
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center'
  },
  buttonText: {
      color: '#eee4e4',
      fontSize: 25
  }
})

export default App;
