import React, { useState, useRef, useEffect } from 'react'
import { View, SafeAreaView, Pressable, Text, Alert, Modal, FlatList, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import { styles } from './style';
import { Camera, CameraType } from 'expo-camera';

export default ExamsScreen = (props) => {
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [examName, setExamName] = useState("");
    const [exams, setExams] = useState([]);
    const [userSearch, setUserSearch] = useState("")
    const [currentExamUri, setCurrentExamUri] = useState();
    const [type, setType] = useState(CameraType.back);
    const [isPreview, setIsPreview] = useState(false);
    const [source, setSource] = useState("");
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const cameraRef = useRef();

    useEffect(() => {
        fetch('https://receitas-node-app-project.onrender.com/api/recipes', {
            method: 'GET',
            headers: {
                'username': props.route.params.name
            },
        }).then(response => response.json())
            .then(data => {
                let examsSize = exams.length
                if (data.length == examsSize) {
                    console.info("Already loaded user data!")
                } else {
                    for (let i = 0; i < data.length; i++) {
                        setExams([...exams, { "id": data[i]['_id'], "name": data[i]['recipename'], "pic_ref": data[i]['recipeimgpath'] }])
                    }
                }

            })
            .catch(error => console.error(error));
    }, [])



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
        index = exams.findIndex(x => x.id === item_id);
        setCurrentExamUri(exams[index].pic_ref)
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
                <Pressable onPress={requestPermission} title="grant permission"><Text style={{ textAlign: 'center' }}>Precisamos da sua permissão para que o App possa usar sua câmera</Text></Pressable>
            </View>
        );
    }

    const filterExams = (item) => {
        if (userSearch === "") {
            return (
                <TouchableOpacity onPress={() => {
                    showExam(item.id)
                }} style={styles.item}>
                    <Text style={styles.item}>{item.name}</Text>
                </TouchableOpacity>
            )
        }
        if (item.name.toLowerCase().includes(userSearch.toLowerCase())) {
            return (
                <TouchableOpacity onPress={() => {
                    showExam(item.id)
                }} style={styles.item}>
                    <Text style={styles.item}>{item.name}</Text>
                </TouchableOpacity>
            )
        }

    }

    return (

        <SafeAreaView style={styles.listContainer} >
            <Modal
                propagateSwipe={true}
                animationType="fade"
                transparent={false}
                visible={registerModalVisible}
                onRequestClose={() => {
                    if (examName === "" || !isPreview) Alert.alert("Exame e/ou Receituário não foi salvo!")
                    if (examName != "" && isPreview) Alert.alert("Exame e/ou Receituário salvo com sucesso!")
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
                                    fetch('https://receitas-node-app-project.onrender.com/api/recipes', {
                                        method: 'POST',
                                        headers: {
                                            'recipename': examName,
                                            'recipeImgPath': source,
                                            'username': props.route.params.name
                                        },
                                    }).then(response => response.json())
                                        .then(data => {
                                            setExams([...exams, { "id": data.insertedId, "name": examName, "pic_ref": source }])
                                            setRegisterModalVisible(!registerModalVisible)
                                        })
                                        .catch(error => console.error(error));
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
            <TextInput style={styles.input} placeholder='Pesquisar Exame' value={userSearch} onChangeText={setUserSearch} autoCorrect={false}
                autoCapitalize='none' />
            <FlatList
                data={exams}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={myItemSeparator}
                ListEmptyComponent={myListEmpty}
                contentContainerStyle={{ justifyContent: 'center' }}
                ListFooterComponent={() => (
                    <Pressable style={styles.Addbutton} onPress={() => {
                        Camera.requestCameraPermissionsAsync()
                        setIsPreview(false)
                        setRegisterModalVisible(true)
                    }}>
                        <Text style={styles.buttonText}>Adicionar Exame e/ou Receituário</Text>
                    </Pressable>
                )}
                renderItem={({ item }) => filterExams(item)}>

            </FlatList>



        </SafeAreaView>
    )
}

