import React, { useState } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    Dimensions,
    I18nManager,
    Platform,
    Image
} from 'react-native';
import { connect } from 'react-redux';
import { appColorsType } from '../../../redux/types/types';
import { WIDTH } from '../config';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements'
import { RootHomeStackParamList } from '../../../router/RootParams';
import { StackNavigationProp } from '@react-navigation/stack';
import { FlatList } from 'react-native-gesture-handler';
import { Table, Row, Rows } from 'react-native-table-component-2';
import { HEIGHT } from '../../../components/config';
import QR from './qr'
// const WIDTH = Dimensions.get('window').width;
// const HEIGHT = Dimensions.get('window').height;

type ScreenProp = StackNavigationProp<RootHomeStackParamList, 'UserEdit'>;

interface IProps {
    theme: appColorsType;
    reduxLang: any;
    Name: string;
    MRN: string;
    Nat: string;
    DOB: string;
    Email: string
    MobileNo: string;
    Username: string;
    navigation: any;
}
const App = ({
    theme,
    reduxLang,
    Name,
    MRN,
    Nat, MobileNo,
    Email,
    DOB,
    Username
}: IProps) => {

    const navigation = useNavigation<ScreenProp>();
    const tableData = {
        tableHead: [reduxLang.MRN, reduxLang.Mobile, ],
        tableData: [
            [MRN, MobileNo, Email.slice(0, 5) + '...'],
        ]
    }


    const [isQR, openQR] = useState<boolean>(false);
    return (
        <View style={[{
            flexDirection: "column", alignContent: 'center', width: '96%', alignItems: 'center', alignSelf: 'center'
        }]}>


            <TouchableOpacity activeOpacity={1} style={[styles.itemContainer, { backgroundColor: theme.secondryBackgroundColor }]}

                onPress={() => navigation.push('UserEdit', {
                    UserName: Username,
                    MRN: MRN
                })}
            >

                <View style={{ flexDirection: "row", alignContent: 'center', paddingVertical: 8, width: WIDTH * 0.95, maxWidth: WIDTH * 0.95, alignSelf: 'center', position: 'relative' }}>
                    <View style={{ flex: 1 }}></View>
                    <TouchableOpacity
                        style={{
                            alignContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'center',
                        }}
                        onPress={() => openQR(true)}>
                        <Image
                            resizeMode={'cover'}
                            style={[{
                                alignContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                marginHorizontal: 2,

                                // width: 200,
                                width: Platform.OS === "ios" ? 40 : 50,
                                height: Platform.OS === "ios" ? 40 : 50,
                                //borderRadius: 26,
                                resizeMode: 'contain'

                            }, {
                                paddingHorizontal: 10,
                            }]}
                            source={require('../../../../assets/qr_user.png')}
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}></View>

                    {tableData.tableHead.map((item, index) => {
                        const getFont = () => {
                            let size;
                            if (I18nManager.isRTL && Platform.OS !== 'ios')
                                size = 10
                            else if (!I18nManager.isRTL && Platform.OS !== 'ios')
                                size = 8;
                            else if (I18nManager.isRTL && Platform.OS === 'ios')
                                size = 9;
                            else
                                size = 20
                            return StyleSheet.create({
                                'font': {
                                    fontSize: size
                                },
                                'biggerFont': {
                                    fontSize: size + 10
                                }
                            })
                        }
                        return (
                            <React.Fragment>
                                <View style={{ flexDirection: "column", paddingVertical: 10, borderRadius: 20, paddingHorizontal: 10 }} >
                                    <Text style={[getFont().font, { paddingBottom: 3, textAlign: 'center', opacity: 0.7, color: theme.primary,fontSize:12 }]}>{item}</Text>
                                    <Text style={[getFont().biggerFont, { textAlign: 'center', color: theme.primary, fontWeight: 'bold', }]}>{tableData.tableData[0][index]}</Text>
                                </View>
                                {index == 2 ? <View></View> : <View style={{ opacity: 0.3, width: 2, height: 20, backgroundColor: theme.primary, top: 15 }}></View>}
                            </React.Fragment>
                        );
                    })}
                    <View style={{ flex: 1 }}></View>
                    <View style={[styles.editIcon,]}>
                        <Icon
                            type='feather'
                            name='info'
                            color={theme.primary}
                            size={theme.appFontSize.smallSize + 5}
                            accessibilityLabel={
                                I18nManager.isRTL ? 'ايقونه معلومات' : 'Icon: Info' // Arabic and English labels based on RTL
                            }
                        />
                    </View>
                    <View style={{ flex: 1 }}></View>

                </View>

            </TouchableOpacity>

            <QR isQR={isQR} openQR={openQR} MRN={MRN} />
        </View>
    );
};

const styles = StyleSheet.create({
    categoryTouch: {
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flashContainer: {

    },
    bold: {
        fontWeight: 'bold'
    },
    flashRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        padding: 10,
        alignItems: 'center',
        paddingBottom: 7
    },
    icon: {
        // position: 'absolute',
        top: 13,
        left: 10,
    },
    Name: {
        // position: 'absolute',
        top: 0,
        left: 60,
        paddingTop: 10,
        // paddingBottom: 10,
        width: 150
    },
    MRN: {
        // position: 'absolute',
        top: 0,
        left: 60,
        paddingTop: 35,
        paddingBottom: 10,
        width: 150
    },
    itemContainer: {

        borderRadius: 15,
        // width: '96%',
        // height:''
        // paddingHorizontal: 175,
        // paddingVertical: 50,
        // paddingTop: 30,
        // paddingBottom: 5,
        // shadowColor:'blue',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.2,
        elevation: 10
    },
    itemContainerView: {
        // position: 'relative',
    },
    tableContainer: {
        width: '93%',
        color: '#69b5d7',
        bottom: 10,
        left: 0,
        right: 0,
        paddingTop: '10%',
        alignSelf: 'center',
    },
    tableHead: {
        textAlign: 'center', fontWeight: "bold", alignItems: 'flex-start'
    },
    tableCell: {
        textAlign: 'center',
        paddingHorizontal: 0
    },
    editIcon: {

        alignSelf: 'center',
        paddingHorizontal: 5

    }
});

const mapStateToProps = (state: any) => ({
    theme: state.configReducer.theme,
    reduxLang: state.configReducer.lang
});

export default connect(mapStateToProps, null)(App);
