import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import QRCode from 'react-native-qrcode-svg';
import Loader from '../../../components/loader';
import { appColorsType } from '../../../redux/types/types';

interface RatingPopupProps {
    openQR(value: boolean): void;
    isQR: boolean;
    theme: appColorsType;
    setIsAuth(value: boolean): void;
    MRN: string;
}

const QRPopup: React.FC<RatingPopupProps> = ({ openQR, isQR, theme, MRN }) => {
    const [loader, setLoader] = useState(false);

    const onClose = () => {
        openQR(false);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isQR}
            onRequestClose={onClose}
        >
            {loader && <Loader theme={theme} loader={loader} />}

            <View style={[styles.centeredView,]}>
               
                <View style={[styles.modalView, {backgroundColor: theme.secondryBackgroundColor}]}>
                <Text style={{color: theme.primary}}>{MRN}</Text>
                    <TouchableOpacity style={[styles.closeButton, {backgroundColor: theme.primaryBackgroundColor}]} onPress={onClose}>
                        <Text style={[styles.closeText, { color: theme.primary}]}>×</Text>
                    </TouchableOpacity>
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={MRN}
                            size={200}
                            color={'white'}
                            backgroundColor={'black'}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
       // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    modalView: {
        margin: 20,
      
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        position: 'relative', // Ensure close button is positioned correctly
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 20,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    qrContainer: {
        marginTop: 30,
    },
});

const mapStateToProps = (state: any) => ({
    theme: state.configReducer.theme,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(QRPopup);
