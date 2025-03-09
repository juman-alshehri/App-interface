import React, { useLayoutEffect, useState, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, I18nManager, ColorValue, AppConfig } from 'react-native';
import { connect } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import { appColorsType, configType } from '../../../redux/types/types';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { URLs } from '../../../configs/APIs'
import renderFooter from '../../../components/renderFooter';
import Toast from 'react-native-root-toast';
import { setIsAuth } from '../../../redux/actions/actions';
import { Icon } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { useHeaderHeight } from '@react-navigation/elements';
import ButtonComponent from '../../../components/button';
import NoDataComponent from '../../../components/noData';

type RootStackParamList = {
  UpdateInfoRequest: {
    Firstname: string,
    SecondName: string,
    ThirdName: string,
    LastName: string,
    Nationality: string,
    Country: string,
    Province: string,
    City: string,
    FirstPhone: string,
    SecondPhone: string
  }
};


interface IProps {
  navigation: StackNavigationProp<RootStackParamList>;
  theme: appColorsType;
  reduxLang: any;
  route: any;
  isDark: boolean;
  rtl: boolean;
  setIsAuth(value: boolean): void;
}

const UserEdit = ({ navigation, theme, reduxLang, route, rtl, setIsAuth, isDark }: IProps) => {


  const { UserName, MRN } = route.params;

  // Header Settings
  const headerHeight = useHeaderHeight();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: false,
      headerTitle: reduxLang.PatientsInfoDetails,
      headerStyle: {
        backgroundColor: theme.primary,
        borderBottomLeftRadius: 0,
        //borderBottomRightRadius: 35,

      },
      headerTintColor: theme.secondryTextColor,
    });
  }, [
    navigation,
    reduxLang.MyOrders,
    theme.secondryBackgroundColor,
    theme.textColor,
  ]);

  let [data, setData] = useState([])
  const [loader, setLoader] = useState(false)
  const [NoData, setNoData] = useState('')
  let scrollRef = useRef<FlatList | null>(null);

  const GetPatientInfo = async () => {
    setLoader(true)
    //console.log('start')
    const url = URLs.GetPatientInfo + `?Nat_ID=${await AsyncStorage.getItem('Username')}&MRN=${await AsyncStorage.getItem('MRN')}&AR=${rtl === true ? 1 : 0}`
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + await AsyncStorage.getItem('Token')
    }

    // const body = {
    //   Nat_ID: await AsyncStorage.getItem('Username'),
    //   MRN: await AsyncStorage.getItem('MRN'),
    //   AR: rtl === true ? 1 : 0
    // }

    await axios
      .get(url, {
        headers
      })
      .then(res => {

        if (res.status === 200) {
          if (res.data.status.errorCode === 21) {
            console.log(res.data.result)
            const retData = []
            for (let i = 0; i < res.data.result.length; i++) {
              retData.push({
                index: i,
                Firstname: res.data.result[i].Firstname,
                SecondName: res.data.result[i].SecondName,
                ThirdName: res.data.result[i].ThirdName,
                LastName: res.data.result[i].LastName,
                Gander: res.data.result[i].Gander,
                AgeYear: res.data.result[i].AgeYear,
                AgeMonth: res.data.result[i].AgeMonth,
                AgeDays: res.data.result[i].AgeDays,
                DOB: res.data.result[i].DOB,
                Nationality: res.data.result[i].Nationality,
                Marital: res.data.result[i].Marital,
                Country: res.data.result[i].Country,
                City: res.data.result[i].City,
                Province: res.data.result[i].Province,
                FirstPhone: res.data.result[i].FirstPhone,
                SecondPhone: res.data.result[i].SecondPhone
              })

            }
            // console.log(res.data.result.length)
            setData(retData)
            //setData(retData)
            setLoader(false)

          } else {

            setLoader(false)
            setNoData(res.data.status.errorMsg)
          }
        } else {
          setLoader(false)
          // console.log(res)
        }
      })
      .catch(function (error) {
        if (error.response.status === 0) {
          Toast.show(reduxLang.ErrorNoNetwork).LONG
        } else if (error.response.status === 401) {
          //Toast.show(error.response.data.Message).LONG
          Toast.show(reduxLang.ErrorLoginAgain).LONG
        } else {
          Toast.show(reduxLang.ErrorServiceUnavailable).LONG
        }
        setNoData(error.response.data.Message)
        setLoader(false)
        setIsAuth(false)
      })
  }

  React.useEffect(() => {
    //console.log(data.length)
    if (data.length === 0) {
      GetPatientInfo();
    }
  }, []);

  React.useEffect(() => {
    //console.log(data)
  }, [data]);

  const singleRow = (theme: appColorsType,
    key: string, value: string, addBackgroudnColor: Boolean) => {
    return (

      <View style={[styles.labelRow, { backgroundColor: isDark ? 'transparent' : addBackgroudnColor ? theme.primaryBackgroundColor : theme.secondryBackgroundColor }]}>
        <Text
          numberOfLines={1}
          style={[styles.textStyle, {
            color: theme.primary,
            opacity: 0.44,
            fontSize: theme.appFontSize.mediumSize - 1,
            fontFamily: theme.appFontSize.fontFamily,
          }]}>
          {key}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.textStyle, {
            color: theme.primary,
            opacity: 0.8,
            fontSize: theme.appFontSize.mediumSize - 1,
            fontFamily: theme.appFontSize.fontFamily,
            fontWeight: 'bold',
            alignItems: !I18nManager.isRTL ? 'flex-start' : 'flex-end'

          }]}>
          {value}
        </Text>
      </View>
    )
  };



  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.secondryBackgroundColor },
      ]}>

      <FlatList
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={true}
        numColumns={1}
        removeClippedSubviews={true}
        legacyImplementation={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={10}
        ListFooterComponent={renderFooter(theme, loader)}
        keyExtractor={(item, index) => index.toString()}
        data={data}
        renderItem={({ item }) => {
          return (
            <View>

              <View style={styles.screenContainer}>

                <View style={styles.rowTitle}>
                  <Text style={[styles.bold,
                  {
                    color: theme.primary,
                    fontWeight: 'bold',
                    fontSize: theme.appFontSize.smallSize,
                    fontFamily: theme.appFontSize.fontFamily
                  }
                  ]}>
                    {reduxLang.PersonalData}
                  </Text>
                  <Icon
                    type='font-awesome-5'
                    name='user-circle'
                    color={theme.primary}
                    size={theme.appFontSize.largeSize}
                    accessibilityLabel={
                      rtl ? 'ايقونه دائرة  المستخدم' : 'Icon: User Circle' // Arabic and English labels based on RTL
                    }
                  />


                </View>

                <TouchableOpacity
                  onPress={() => console.log('')
                  }
                  style={[
                    styles.bodyTextStyle,
                    {
                      backgroundColor: theme.secondryBackgroundColor,
                      shadowColor: theme.primary,
                    },
                  ]}>

                  {singleRow(theme, reduxLang.FirstName, item.Firstname, true)}
                  {singleRow(theme, reduxLang.SecondName, item.SecondName, false)}
                  {singleRow(theme, reduxLang.ThirdName, item.ThirdName, true)}
                  {singleRow(theme, reduxLang.LastName, item.LastName, false)}
                  {singleRow(theme, reduxLang.Gander, item.Gander, true)}
                  {singleRow(theme, reduxLang.DOB, item.DOB, false)}
                  {singleRow(theme, reduxLang.Age, item.AgeYear + reduxLang.AgeYear + item.AgeMonth + reduxLang.AgeMonth + item.AgeDays + reduxLang.AgeDays, true)}
                  {singleRow(theme, reduxLang.Nationality, item.Nationality, false)}


                </TouchableOpacity>

              </View>

              <View style={styles.screenContainer}>

                <View style={styles.rowTitle}>

                  <Text style={[styles.bold,
                  {
                    color: theme.primary,
                    fontWeight: 'bold',
                    fontSize: theme.appFontSize.smallSize,
                    fontFamily: theme.appFontSize.fontFamily
                  }
                  ]}>
                    {reduxLang.PatientAddress}
                  </Text>
                  <Icon
                    type='font-awesome-5'
                    name='map'
                    color={theme.primary}
                    size={theme.appFontSize.largeSize}
                    accessibilityLabel={
                      rtl ? 'ايقونه خريطة' : 'Icon: Map' // Arabic and English labels based on RTL
                    }
                  />
                </View>

                <TouchableOpacity
                  onPress={() => console.log('')
                  }
                  style={[
                    styles.bodyTextStyle,
                    {
                      backgroundColor: theme.secondryBackgroundColor,
                      shadowColor: theme.primary,
                    },
                  ]}>

                  {singleRow(theme, reduxLang.Country, item.Country, true)}
                  {singleRow(theme, reduxLang.Province, item.Province, false)}
                  {singleRow(theme, reduxLang.City, item.City, true)}

                </TouchableOpacity>

              </View>

              <View style={styles.screenContainer}>

                <View style={styles.rowTitle}>
                  <Text style={[styles.bold,
                  {
                    color: theme.primary,
                    fontWeight: 'bold',
                    fontSize: theme.appFontSize.smallSize,
                    fontFamily: theme.appFontSize.fontFamily
                  }
                  ]}>
                    {reduxLang.PatientContact}
                  </Text>
                  <Icon
                    type='font-awesome-5'
                    name='phone'
                    color={theme.primary}
                    size={theme.appFontSize.largeSize}
                    accessibilityLabel={
                      rtl ? 'ايقونه هاتف' : 'Icon: Phone' // Arabic and English labels based on RTL
                    }
                  />
                </View>

                <TouchableOpacity
                  onPress={() => console.log('')
                  }
                  style={[
                    styles.bodyTextStyle,
                    {
                      backgroundColor: theme.secondryBackgroundColor,
                      shadowColor: theme.primary,
                    },
                  ]}>

                  {singleRow(theme, reduxLang.FirstPhone, item.FirstPhone, true)}
                  {singleRow(theme, reduxLang.SecondPhone, item.SecondPhone, false)}

                </TouchableOpacity>

              </View>



              <ButtonComponent
                isLoading={loader}
                onPress={() => {
                  navigation.navigate('UpdateInfoRequest', {
                    Firstname: item.Firstname, SecondName: item.SecondName, ThirdName: item.ThirdName, LastName: item.LastName, Nationality: item.Nationality, Country: item.Country, Province: item.Province, City: item.City, FirstPhone: item.FirstPhone, SecondPhone: item.SecondPhone
                  })
                }}
                theme={theme}
                title={reduxLang.UpdateInfoRequest}
                loadingText={reduxLang.Loading}
              />

            </View>
          )
        }}
        ref={scrollRef}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={<NoDataComponent text={NoData} theme={theme} isDark={isDark} />}
      />



    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 5,

  },
  screenContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 100,
    marginVertical: 5
  },
  textStyle: {
    textAlign: 'left',
    padding: 5,
  },
  bodyTextStyle: {
    width: '94%',
    padding: 10,
    borderRadius: 12,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 8,
    marginTop: 10,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  titleView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    paddingTop: 10,
    paddingBottom: 4,
    margin: 10,
    marginTop: 5,
    borderRadius: 24,
  },
  scrollViewContainerStyle: {
    paddingBottom: 5,
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bold: {
    fontWeight: 'bold'
  },
  rowTitle: {
    flexDirection: 'row',
    width: '94%',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
    paddingBottom: 2
  },
  button: {
    margin: 10,
    //paddingTop: 5,
    borderRadius: 25
  }
});

const mapStateToProps = (state: any) => ({
  theme: state.configReducer.theme,
  reduxLang: state.configReducer.lang,
  isDark: state.configReducer.isDarkMode,
  rtl: state.configReducer.rtl
});


const mapDispatchToProps = (dispatch: any) => ({
  setIsAuth: (value: boolean) => dispatch(setIsAuth(value)),
  // config: ():boolean => dispatch(isdar)
});

export default connect(mapStateToProps, mapDispatchToProps)(UserEdit);
