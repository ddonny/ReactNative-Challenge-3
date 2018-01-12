import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableWithoutFeedback, Animated } from 'react-native';
import Images from './images';


class PhotoFocus extends React.Component {

  state={
      activeImage: null,
      activeIndex: null,
      size: new Animated.ValueXY(),
      position: new Animated.ValueXY(),
      animation: new Animated.Value(0)
  }

  componentWillMount(){
      this._gridImages = {};
  }

  handleOpenImage = (idx) => {
    this._gridImages[idx].measure((x, y, width, height, pageX, pageY) => {
        this._x = pageX
        this._y = pageY
        this._width = width
        this._height = height

        this.state.position.setValue({
            x: pageX,
            y: pageY
        })

        this.state.size.setValue({
            x: width,
            y: height
        })

        this.setState({
            activeImage: Images[idx],
            activeIndex: idx
        }, () => {
            this._viewImage.measure((tX, tY, tWidth, tHeight, tPageX, tPageY) => {
                Animated.parallel([
                    Animated.spring(this.state.position.x, {
                        toValue: tPageX
                    }),
                    Animated.spring(this.state.position.y, {
                        toValue: tPageY
                    }),
                    Animated.spring(this.state.size.x, {
                        toValue: tWidth
                    }),
                    Animated.spring(this.state.size.y, {
                        toValue: tHeight
                    }),
                    Animated.spring(this.state.animation, {
                        toValue: 1
                    })
                ]).start()
            })
        })
    })
  }

  handleClose = () => {
      Animated.parallel([
        Animated.timing(this.state.position.x, {
              toValue: this._x,
              duration: 250
          }),
          Animated.timing(this.state.position.y, {
            toValue: this._y,
            duration: 250
          }),
          Animated.timing(this.state.size.x, {
            toValue: this._width,
            duration: 250
          }),
          Animated.timing(this.state.size.y, {
            toValue: this._height,
            duration: 250
          }),
          Animated.timing(this.state.animation, {
            toValue: 0,
            duration: 250
          })
      ]).start(() => {
          this.setState({
              activeImage: null
          })
      })
  }

  render() {

    const animatedContentTranslate = this.state.animation.interpolate({
        inputRange: [0, 1],
        outputRange: [300, 0]
    })

    const animatedContentStyle = {
        opacity: this.state.animation,
        transform: [
            {
                translateY: animatedContentTranslate
            }
        ]
    }

    const activeImageStyle = {
        width: this.state.size.x,
        height: this.state.size.y,
        top: this.state.position.y,
        left: this.state.position.x
    }

    const activeIndexStyle = {
        opacity: this.state.activeImage ? 0 : 1
    }

    const animatedCloseStyle = {
        opacity: this.state.animation
    }


    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
            <View style={styles.grid}>
            {
                Images.map((src, idx) => {

                    const style = idx === this.state.activeIndex ? activeIndexStyle : undefined

                    return (
                        <TouchableWithoutFeedback
                            key={idx}
                            onPress={() => this.handleOpenImage(idx)}
                        >
                            <Image
                                source={src}
                                resizeMode="cover"
                                style={[styles.photoStyle, style]}
                                ref={image => this._gridImages[idx] = image}
                            />
                        </TouchableWithoutFeedback>
                    )
                })
            }
            </View>
        </ScrollView>

        <View 
            style={StyleSheet.absoluteFill}
            pointerEvents={this.state.activeImage ? "auto" : "none"}
        >
            <View
                style={styles.topContent}
                ref={image => this._viewImage = image}
                onLayout={() => {}} // For Android
            >
                
            </View>
            <Animated.View
                style={[styles.content, animatedContentStyle]}
            >
                <Text style={styles.title}>
                    Meme Gallery
                </Text>
                <Text>
                    This is a meme. This is a meme. This is a meme. 
                    This is a meme. This is a meme. This is a meme. 
                    This is a meme. This is a meme. This is a meme. 
                    This is a meme. This is a meme. This is a meme. 
                    This is a meme. This is a meme. This is a meme. 
                </Text>
            </Animated.View>
        </View>
        <Animated.Image
            key={this.state.activeImage}
            source={this.state.activeImage}
            resizeMode="cover"
            style={[styles.viewImage, activeImageStyle]}
        />
        <TouchableWithoutFeedback onPress={this.handleClose}>
            <Animated.View  style={[styles.close, animatedCloseStyle]}>
                <Text style={styles.closeText}>X</Text>
            </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  grid: {
      flexDirection: 'row',
      flexWrap: 'wrap'
  },
  photoStyle: {
      width: "33%",
      height: 150,
  },
  topContent: {
      flex: 1, 
  },
  content: {
      flex: 2,
      backgroundColor: 'white'
  },
  viewImage: {
      width: null,
      height: null,
      position: "absolute",
      top: 0,
      left: 0
  },
  title: {
      fontSize: 28
  },
  close: {
      position: "absolute",
      top: 20,
      right: 20
  },
  closeText: {
      backgroundColor: "transparent",
      fontSize: 28,
      color: "#FFF"
  }
});


export default PhotoFocus;