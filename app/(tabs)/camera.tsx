import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission, useFrameProcessor } from 'react-native-vision-camera';
import { useFaceDetector } from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core';


export default function CameraScreen() {
    const device = useCameraDevice('front');
    const { hasPermission, requestPermission } = useCameraPermission();
    const [face, setFace] = useState<any>(null);
    const [frameSize, setFrameSize] = useState({ width: 1, height: 1 });
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');



    const { detectFaces } = useFaceDetector({ performanceMode: 'fast' });


    const updateFace = Worklets.createRunOnJS((faceData: any, width: number, height: number) => {
        setFace(faceData);
        if (frameSize.width !== width) {
            setFrameSize({ width, height });
        }
    });

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        const faces = detectFaces(frame);

        if (faces && faces.length > 0) {
            updateFace(faces[0], frame.width, frame.height);
        } else {
            updateFace(null, frame.width, frame.height);
        }
    }, [detectFaces]);

    useEffect(() => {
        requestPermission();
    }, []);

    if (!hasPermission) return <Text>No permission</Text>;
    if (!device) return <Text>No device</Text>;

    const scaleX = SCREEN_WIDTH / frameSize.height;
    const scaleY = SCREEN_HEIGHT / frameSize.width;

    return (
        <View style={styles.container}>
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                pixelFormat="yuv"
                frameProcessor={frameProcessor}
                resizeMode="cover"
            />

            {face && (
                <>
                    <Image
                        source={require('@/assets/images/pikachu.png')}
                        style={[
                            styles.pikachu,
                            {
                                top: (face.bounds.y * scaleY) - 60,
                                left: SCREEN_WIDTH - (face.bounds.x * scaleX) - (face.bounds.width * scaleX / 2) - 30,
                            }
                        ]}
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: 'black' },
    pikachu: {
        position: 'absolute',
        width: 60,
        height: 60,
        zIndex: 100,
    }
});