import React, { useState, useRef } from 'react'
import { View, StyleSheet, SafeAreaView, Pressable, Text, Alert, Modal, FlatList, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import { Camera, CameraType } from 'expo-camera';

export default ExamsScreen = (props) => {
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [examName, setExamName] = useState("");
    const [exams, setExams] = useState([]);
    const [currentExamUri, setCurrentExamUri] = useState();
    const [type, setType] = useState(CameraType.back);
    const [isPreview, setIsPreview] = useState(false);
    const [source, setSource] = useState("");
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const cameraRef = useRef();

    const myListEmpty = () => {
        return (
          <View style={{ alignItems: "center" }}>
          <Text style={styles.item}>Sem Exames e/ou Receituários</Text>
          </View>
        );
      };

    const myItemSeparator = () => {
        return <View style={{ height: 1, backgroundColor: "grey", marginHorizontal: 10 }} />;
    };

    const showExam = (item_id) => {
        setCurrentExamUri(exams[item_id].pic_ref)
        setPreviewModalVisible(true)
    }

    const takePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true, skipProcessing: true };
            const data = await cameraRef.current.takePictureAsync(options);
            const source = data.uri;
            if (source) {
                await cameraRef.current.pausePreview();
                setIsPreview(true);
                setSource(source);
            }
        }
    };

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {

        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Pressable onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    return (

        <SafeAreaView style={styles.listContainer} >
            <Modal
                propagateSwipe={true}
                animationType="fade"
                transparent={false}
                visible={registerModalVisible}
                onRequestClose={() => {
                    if(examName === "" || !isPreview) Alert.alert("Exame e/ou Receituário não foi salvo!")
                    if(examName != "" && isPreview) Alert.alert("Exame e/ou Receituário salvo com sucesso!")
                    setRegisterModalVisible(!registerModalVisible);
                }}>
                <ScrollView contentContainerStyle={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Adicionar Exame e/ou Receituário</Text>
                        <TextInput style={styles.input} placeholder='Adicionar nome do Exame e/ou Receituário' value={examName} onChangeText={setExamName} autoCorrect={false}
                            autoCapitalize='none' />
                        <Camera ref={cameraRef} style={styles.camera} type={type}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                                    <Text style={styles.text}>Flip Camera</Text>
                                </TouchableOpacity>
                            </View>
                        </Camera>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                takePicture()
                            }}>

                            <Text style={styles.textStyle}>Tirar foto do Exame e/ou Receituário</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                if (examName !== "" && isPreview) {
                                    setExams([...exams, { "id": exams.length, "name": examName, "pic_ref": source }])
                                    setRegisterModalVisible(!registerModalVisible)
                                } else {
                                    Alert.alert('É necessário dar um nome e/ou tirar uma foto do registro! ');
                                }
                            }}>
                            <Text style={styles.textStyle}>Salvar</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </Modal>
            <Modal
                propagateSwipe={true}
                animationType="fade"
                transparent={false}
                visible={previewModalVisible}
                onRequestClose={() => {
                    setPreviewModalVisible(!previewModalVisible);
                }}>
                <View >
                    <Image style={{ width: '100%', height: '100%', resizeMode: 'cover' }} source={{ uri: currentExamUri }}></Image>
                </View>
            </Modal>
            <FlatList
                data={exams}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={myItemSeparator}
                ListEmptyComponent={myListEmpty}
                contentContainerStyle={{justifyContent: 'center'}}
                ListFooterComponent={() => (
                    <Pressable style={styles.Addbutton} onPress={() => {
                        Camera.requestCameraPermissionsAsync()
                        setIsPreview(false)
                        setRegisterModalVisible(true)
                    }}>
                        <Text style={styles.buttonText}>Adicionar Exame e/ou Receituário</Text>
                    </Pressable>
                )}
                renderItem={({ item }) => <TouchableOpacity onPress={() => showExam(item.id)} style={styles.item}><Text style={styles.item}>{item.name}</Text></TouchableOpacity>}>

            </FlatList>



        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    camera: {
        flex: 1
    },
    centeredView: {
        flex: 1,
        alignItems: 'center',
        marginTop: 22,
    },
    listContainer: {
        flex: 1,
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    button: {
        marginTop: 10,
        padding: 10,
        elevation: 2,
    },
    Addbutton: {
        backgroundColor: "blue",
        height: 45,
        borderColor: "blue",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20

    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: "red",
        borderWidth: 1,
        borderRadius: 7
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    buttonView: {
        width: "100%",
        paddingHorizontal: 50
    },
    optionsText: {
        textAlign: "center",
        paddingVertical: 10,
        color: "gray",
        fontSize: 13,
        marginBottom: 6
    },
    item: {
        flex: 1,
        padding: 30,
        fontSize: 24,
    },
    image: {
    }
})