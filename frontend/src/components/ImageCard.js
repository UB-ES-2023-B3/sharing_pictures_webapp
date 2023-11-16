import React, { Component } from 'react';
import { ChakraProvider } from '@chakra-ui/react'
import {
  IconButton,
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  Select,
  Divider,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea
} from '@chakra-ui/react'
import { FiHeart } from "react-icons/fi";
import axios from 'axios';
import { ExternalLinkIcon, LinkIcon, DownloadIcon, StarIcon } from '@chakra-ui/icons'


export default class ImageCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageHeight: 0,
      isFollowing: false,
      isLiked: false,
      isReporting: false,
      reportReason: '',
      reportDescription: '',
      reportSubmitted: false,
      postOwner: '',
      user: "",
      comments: [], // Inicializa 'comments' como un array vacío
      newCommentText: '', // Estado para almacenar el texto del nuevo comentario


    };

    this.imageRef = React.createRef();
    this.fetchUser2();
  }

  getOwnerOfPost = () => {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    fetch('/api/getOwnerPost/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post_id: id }),
    })
      .then(response => response.json())
      .then(result => {
        this.setState({ postOwner: result.message });
        this.handleIsFollowing(result.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  componentDidMount() {
    // Obtenemos la altura de la imagen una vez que esté cargada
    this.imageRef.current.onload = () => {
      const height = this.imageRef.current.clientHeight;
      this.setState({ imageHeight: height });
      this.getOwnerOfPost();
    };

  }

  toggleFollow = () => {
    this.callBackendToggleFollow();
  };
  callBackendToggleFollow = () => {
    // Realiza la llamada al backend aquí
    // Puedes usar axios para hacer una solicitud POST o GET al servidor


    fetch('/api/follow/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.state.user, user: this.state.postOwner }),
    })
      .then(response => {
        // Manejar la respuesta del servidor si es necesario
        this.handleIsFollowing();
      })
      .catch(error => {
        // Manejar errores si la solicitud falla
        console.error('Error en la solicitud al backend:');
      });
  }


  handleIsFollowing = () => {

    fetch('/api/get_is_user_following/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.state.user, user: this.state.postOwner }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.message === 'Follow') {
          this.setState({ isFollowing: true })
        } else if (result.message === 'Unfollow') {
          this.setState({ isFollowing: false })
        }

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  toggleLike = () => {
    this.setState((prevState) => ({
      isLiked: !prevState.isLiked,
    }));
  };
  openReportModal = () => {
    this.setState({ isReporting: true });
  };

  closeReportModal = () => {
    this.setState({
      isReporting: false,
      reportReason: '',
      reportDescription: '',
    });
  };


  handleReportReasonChange = (event) => {
    this.setState({ reportReason: event.target.value });
  };

  handleReportDescriptionChange = (event) => {
    this.setState({ reportDescription: event.target.value });
  };


  handleReportSubmit = () => {
    // Supongamos que enviaste el informe al servidor aquí
    // Esto es solo una simulación

    // Cambiar el estado para mostrar el mensaje de agradecimiento
    this.setState({ reportSubmitted: true });

    // Cerrar el cuadro de diálogo de reporte
    setTimeout(() => {
      this.closeReportModal();
    }, 2000); // Cierra el cuadro de diálogo después de 2 segundos
  };
  renderDescription(descriptionWithHashtags, hashtags) {
    if (descriptionWithHashtags && descriptionWithHashtags.trim() !== "") {
      const words = descriptionWithHashtags.split(' ');
      return (
        <Box style={styles.boxStyle}>
          <Text fontSize='2xl' paddingTop="5%">
            {words.map((word, index) => (
              word.startsWith('#') ? (
                <strong key={index}>{word} </strong>
              ) : (
                <span key={index}>{word} </span>
              )
            ))}
          </Text>
        </Box>
      );
    } else {
      return (
        <Box style={styles.boxStyle}>
          <Text fontSize='2xl' paddingTop="5%">Ningúna descripción añadida</Text>
        </Box>
      );
    }
  }


  handleIsLiked2 = (user) => {

    const urlParams = new URLSearchParams(window.location.search);

    const id = urlParams.get('id');

    fetch('/api/get_is_liked/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: user, post_id: id }),
    })
      .then(response => response.json())
      .then(result => {
        if (result.message === 'Sacar like') {
          // Si el mensaje es "Sacar like", establece isClicked en false
          this.setState({ isLiked: true });
        } else if (result.message === 'añadir like') {
          // Si el mensaje es "añadir like", establece isClicked en true
          this.setState({ isLiked: false })

        }

      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  
  renderComments = () => {
    const { comments } = this.state;
  
    if (!comments || !Array.isArray(comments) || comments.length === 0) {
      return (
        <div style={styles.commentsContainer}>
          <p>No hay comentarios aún.</p>
        </div>
      );
    }
  
    return (
      <div style={{ ...styles.commentsContainer, maxHeight: '200px', overflowY: 'auto', padding: '10px' }}>
        {/* Iterar sobre los comentarios y mostrarlos */}
        {comments.map((comment, index) => (
          <div key={index} style={styles.comment}>
            {/* Avatar del usuario */}
            <Avatar src={comment.avatar} alt={`User ${index + 1}`} style={styles.commentAvatar} />
            {/* Contenido del comentario */}
            <Textarea
              value={comment.content}
              isReadOnly
              size="sm"
              resize="none"
              border="none"
              borderRadius="md"
              maxWidth="100%"
              maxHeight="80px"
              overflow="auto"
            />
          </div>
        ))}
      </div>
    );
  };
  handleCommentSubmit = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const id = urlParams.get('id');


    const newComment = {
      avatar: 'https://via.placeholder.com/150', // URL de ejemplo de una imagen genérica
      content: this.state.newCommentText,
    };
  
    // Enviar el comentario al backend
    fetch('/api/upload_comment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: id, // Obtén el ID del post actual
        username: this.state.user,
        comment: newComment.content,
      }),
    })
    .then(response => response.json())
    .then(result => {
      // Manejar la respuesta del backend si es necesario
      // Por ejemplo, puedes actualizar el estado de los comentarios en la tarjeta
      // Ejemplo:
      const updatedComments = [...this.state.comments, newComment];
      this.setState({ comments: updatedComments, newCommentText: '' });
    })
    .catch(error => {
      // Manejar errores si la solicitud falla
      console.error('Error en la solicitud al backend:', error);
    });
  };
  handleCommentTextChange = (event) => {
    this.setState({ newCommentText: event.target.value });
  };
  fetchUser2 = () => {

    // Fetch more posts from the API and append them to the existing posts

    fetch("/api/get_logged_in_user/")
      .then((response) => response.json())
      .then((data) => {

        this.setState({ user: data.username });
        this.handleIsLiked2(data.username);
      })
      .catch((error) => {
        console.error('Error loading more posts:', error);
      });
  };

  render() {
    const { imageHeight, isReporting, reportReason, reportDescription, reportSubmitted } = this.state;
    const { isLarge } = this.props;
    const urlParams = new URLSearchParams(window.location.search);
    const size = urlParams.get('size');
    const image = urlParams.get('image');

    const id = urlParams.get('id');
    const description = urlParams.get('description');
    const username = urlParams.get('username');


    const { isFollowing } = this.state;
    const followButtonText = isFollowing ? 'Seguint' : 'Seguir';
    const isLiked = this.state.isLiked;




    const handleButtonClicked = (event) => {

      event.stopPropagation(); // Evita la propagación del clic al contenedor

      fetch('/api/likes/', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: this.state.user, post_id: id }),
      })
        .then(response => {
          // Manejar la respuesta del servidor si es necesario
          handleIsLiked();
        })
        .catch(error => {
          // Manejar errores si la solicitud falla
          console.error('Error en la solicitud al backend:');
        });


    }

    const handleIsLiked = (event) => {


      fetch('/api/get_is_liked/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: this.state.user, post_id: id }),
      })
        .then(response => response.json())
        .then(result => {
          if (result.message === 'Sacar like') {
            // Si el mensaje es "Sacar like", establece isClicked en false
            this.setState({ isLiked: true })
          } else if (result.message === 'añadir like') {
            // Si el mensaje es "añadir like", establece isClicked en true
            this.setState({ isLiked: false })
          }

        })
        .catch(error => {
          console.error('Error:', error);
        });
    }



    const handleDownload = () => {
      const a = document.createElement('a');
      a.href = this.imageRef.current.src;
      a.download = 'imagen.jpg'; // Nombre del archivo de descarga
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      alert('La imagen se ha descargado exitosamente');
    };

    const handleCopyUrl = () => {
      const currentUrl = window.location.href;

      navigator.clipboard.writeText(currentUrl)
        .then(() => {
          alert('URL copiada al portapapeles: ' + currentUrl);
        })
        .catch(error => {
          console.error('Error al copiar la URL: ' + error);
        });
    };
    return (
      <ChakraProvider>
        <div style={styles.centeredContainer}>
          <div
            style={{
              ...styles.card,
              height: `${imageHeight}px`,
            }}
          >
            <div style={styles.imageHalf}>
              <div style={styles.imageContainer}>
                <img
                  ref={this.imageRef}
                  src={image}
                  alt="Imagen"
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <div div style={styles.imageleft}>
              <Flex marginLeft="10px" marginRight='10px' justifyContent="space-between" >
                <Box width='100%'>
                  <IconButton size='lg' borderRadius='30' variant='ghost' marginRight="0"
                    ml="auto"
                    onClick={handleButtonClicked}
                    icon={
                      <FiHeart
                        fontSize="2rem"
                        className='heart'

                        fill={isLiked ? "red" : "#1a1b1b"}
                        opacity={isLiked ? 1 : 0.5}
                        color={isLiked ? "red" : "white"}
                      />
                    }


                  />
                  <Box >
                    <IconButton size='lg' borderRadius='30' variant='ghost' icon={<DownloadIcon />} onClick={handleDownload} />
                    <IconButton size='lg' borderRadius='30' variant='ghost' icon={<LinkIcon />} onClick={handleCopyUrl} />
                  </Box>
                  {this.renderComments()}
                  {/* Formulario para agregar comentarios */}
                  <div style={styles.commentInput}>
                    <Input
                      value={this.state.newCommentText}
                      onChange={this.handleCommentTextChange}
                      placeholder="Agrega un comentario..."
                      style={styles.commentInputField}
                    />
                    <Button
                      onClick={this.handleCommentSubmit}
                      style={styles.commentSendButton}
                    >
                      Enviar
                    </Button>
                  </div>

                </Box>
              </Flex>
              <div div style={styles.imageleft}>
                {this.state.postOwner === this.state.user ? <Box /> : <Box padding="5%">
                  <Button borderRadius="30" size="lg" ml="auto" marginRight="0" onClick={this.toggleFollow} style={{
                    backgroundColor: isFollowing ? 'black' : 'red',
                    color: 'white',
                  }}>
                    {followButtonText}
                  </Button>
                </Box >}
              </div>
            </div>
          </div>
        </div>
      </ChakraProvider>
    );
  }
}

const styles = {
  centeredContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // Esto ocupa el 100% del alto de la pantalla
    paddingTop: "10%",

  },

  card: {
    margin: '15px',
    padding: 0,
    borderRadius: '16px',
    backgroundColor: 'white',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'row', // Cambia a fila para alinear elementos horizontalmente
    overflow: 'hidden',
    width: '60%', // Ajusta el ancho de la tarjeta según tus necesidades
  },

  imageleft: {
    width: '50%',

  },
  imageHalf: {
    width: '50%', // Establece el ancho para la mitad de la imagen

  },

  commentsHalf: {
    width: '50%', // Establece el ancho para la mitad de los comentarios

  },

  imageContainer: {
    width: '100%', // Establece el ancho para la imagen
    background: '#ddd', // Color de fondo mientras se carga la imagen
  },

  boxStyle: {
    paddingTop: "5%",

  },

  comments: {
    padding: '2%',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  followButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    cursor: 'pointer',
  },
  likeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  downloadButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  descriptionStyle: {
    marginTop: '1%',
  },
  commentsContainer: {
    // Estilos para el contenedor de comentarios
  },
  comment: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
  },
  commentAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  commentInput: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  commentInputField: {
    flex: 1,
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  commentSendButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    marginLeft: '10px',
    cursor: 'pointer',
  },
  actions: {
    marginTop: '10px',
  },
  shareButton: {

  },
  reportButton: {

  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  followButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    cursor: 'pointer',
  },
  likeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  downloadButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  commentsContainer: {
    // Estilos para el contenedor de comentarios
  },
  comment: {
    display: 'flex',
    alignItems: 'center',
    margin: '10px 0',
  },
  commentAvatar: {
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    marginRight: '10px',
  },
  commentInput: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '10px',
  },
  commentInputField: {
    flex: 1,
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
  commentSendButton: {
    backgroundColor: 'blue',
    color: 'white',
    padding: '5px 10px',
    border: 'none',
    marginLeft: '10px',
    cursor: 'pointer',
  },
  actions: {
    marginTop: '10px',
  },
  shareButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  reportButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },

  large: {
    height: '700px', // Ajusta la altura para tarjetas grandes
  },
};
