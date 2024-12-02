import React, { useState, useRef, useEffect } from 'react'
import { View, SafeAreaView, Pressable, Text, Alert, Modal, FlatList, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import { Icon } from '@rneui/themed';
import { styles } from './style';
import { CameraView,  useCameraPermissions } from 'expo-camera';
import { supabase } from '../utils/supabase'

export default ExamsScreen = (props) => {
    
    const [registerModalVisible, setRegisterModalVisible] = useState(false);
    const [previewModalVisible, setPreviewModalVisible] = useState(false);
    const [examName, setExamName] = useState("");
    const [exams, setExams] = useState([]);
    const [userSearch, setUserSearch] = useState("")
    const [currentExamUri, setCurrentExamUri] = useState();
    const [currentExamId, setCurrentExamId] = useState("")
    const [type, setType] = useState("back");
    const [isPreview, setIsPreview] = useState(false);
    const [source, setSource] = useState("");
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef();

    const adaptExams = (data) => {
        return data.map(({ _id, recipename, recipeimgpath, usable }) => ({
            id: _id,
            recipename,
            recipeimgpath,
            usable
        }))
    }

    useEffect(() => {
        fetch('https://receitas-node-app-project.onrender.com/api/recipes', {
            method: 'GET',
            headers: {
                'username': props.route.params.name
            },
        })
            .then(response => { return response.json() })
            .then(data => setExams((prevExams) => prevExams.concat(adaptExams(data))))
            .catch(err => console.log(err))

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
        let index = exams.findIndex(x => x.id === item_id);
        setCurrentExamUri(exams[index].recipeimgpath)
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
        setType(current => (current === 'back' ? 'front' : 'back'));
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

    const invalidateRecipe = (id) => {
        Alert.alert("Invalidar Receita e/ou Exame", "Deseja Realmente invalidar Receita e/ou Exame ?", [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK', onPress: () => {
                    fetch('https://receitas-node-app-project.onrender.com/api/recipes', {
                        method: 'PATCH',
                        headers: {
                            'id': id,
                            'usable': false
                        },
                    }).then(response => response.json())
                        .then(data => {
                            if (data.modifiedCount == 1) {
                                let index = exams.findIndex(x => x.id === item.id);
                                Alert.alert("Exame Invalidádo!", exams[index].recipename)
                            }
                        })
                        .catch(error => console.error(error));
                }
            },
        ])

    }

    const filterExams = (item) => {
        let index = exams.findIndex(x => x.id === item.id);
        if (exams[index].usable == 'false') {
            if (userSearch === "") {
                return (
                    <TouchableOpacity onPress={() => {
                        showExam(item.id)
                    }} style={styles.item}>
                        <Text style={styles.item}>{item.recipename}</Text>
                        <Icon
                            name='heartbeat'
                            type='font-awesome'
                        />
                    </TouchableOpacity>
                )
            }
            if (item.recipename.toLowerCase().includes(userSearch.toLowerCase())) {

                return (
                    <TouchableOpacity onPress={() => {
                        showExam(item.id)
                    }} style={styles.item}>
                        <Text style={styles.item}>{item.recipename}</Text>

                        <Icon
                            name='heartbeat'
                            type='font-awesome'
                        />
                    </TouchableOpacity>
                )
            }
        } else {
            if (userSearch === "") {
                return (
                    <TouchableOpacity onPress={() => {
                        showExam(item.id)
                    }} style={styles.item}>
                        <Text style={styles.item}>{item.recipename}</Text>
                        <Icon
                            name='heartbeat'
                            type='font-awesome'
                            color='#f50'
                            onPress={() => invalidateRecipe(item.id)} />
                    </TouchableOpacity>
                )
            }
            if (item.recipename.toLowerCase().includes(userSearch.toLowerCase())) {

                return (
                    <TouchableOpacity onPress={() => {
                        showExam(item.id)
                    }} style={styles.item}>
                        <Text style={styles.item}>{item.recipename}</Text>

                        <Icon
                            name='heartbeat'
                            type='font-awesome'
                            color='#f50'
                            onPress={() => invalidateRecipe(item.id)} />
                    </TouchableOpacity>
                )
            }
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
                        <CameraView facing={type} ref={cameraRef} style={styles.camera} type={type}>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
                                    <Text style={styles.text}>Flip Camera</Text>
                                </TouchableOpacity>
                            </View>
                        </CameraView>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                takePicture()
                            }}>

                            <Text style={styles.textStyle}>Tirar foto do Exame e/ou Receituário</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={async () => {
                                if (examName !== "" && isPreview) {
                                    const response = await fetch(source);
                                    const blob = await response.blob();
                                    const arrayBuffer = await new Response(blob).arrayBuffer();
                                    
                                    const fileName = `public/${props.route.params.name}/${Date.now()}.jpg`;
                                    
                                    const bucket = supabase.storage.from(process.env.BUCKET_NAME)
                                    const { error } = await bucket.upload( fileName , arrayBuffer )
                                    if (error) {
                                        Alert.alert('Error uploading image: ', error);
                                    }
                                    fetch('https://receitas-node-app-project.onrender.com/api/recipes', {
                                        method: 'POST',
                                        headers: {
                                            'recipename': examName,
                                            'recipeImgPath': process.env.process.env.SUPABASE_URL + "storage/v1/object/public/" + process.env.BUCKET_NAME + "/" + fileName ,
                                            'username': props.route.params.name
                                        },
                                    }).then(response => response.json())
                                        .then(data => {
                                            setExams([...exams, { "id": data.insertedId, "recipename": examName, "recipeimgpath": source }])
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
                        requestPermission()
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

