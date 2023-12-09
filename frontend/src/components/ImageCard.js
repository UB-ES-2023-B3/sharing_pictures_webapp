import React, { Component } from 'react';
import { ChakraProvider, Icon } from '@chakra-ui/react'
import {
  IconButton,
  Box,
  Flex,
  Text,
  Avatar,
  Button,
  Select,
  Divider,
  Spacer,
  Input,
  InputGroup,
  InputRightElement,
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
import { DeleteIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { ExternalLinkIcon, LinkIcon, DownloadIcon, WarningIcon } from '@chakra-ui/icons'
import { MdSend } from "react-icons/md";
import Swal from 'sweetalert2';

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
      showFullDescription: false,
      avatarURL: "",
      comments: [], // Inicializa 'comments' como un array vacío
      newCommentText: '', // Estado para almacenar el texto del nuevo comentario
      avatar: "",
      email: "",
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
        const ownerPost = result.message;
        this.setState({ postOwner: result.message });
        this.handleIsFollowing(result.message);
        this.avatarprofile(result.message);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  getCommentsOfPost = () => {

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    fetch('/api/getCommentsOfPost/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post_id: id }),
    })
      .then(response => response.json())
      .then(result => {
        this.state.comments = result.comments;
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
      this.getCommentsOfPost();
    };

  }

  toggleFollow = () => {
    this.callBackendToggleFollow();
  };
  callBackendToggleFollow = () => {
    // Realiza la llamada al backend aquí
    // Puedes usar axios para hacer una solicitud POST o GET al servidor
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
        const ownerPost = result.message;
        fetch('/api/follow/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: this.state.user, user: ownerPost }),

        })
          .then(response => {
            // Manejar la respuesta del servidor si es necesario
            this.handleIsFollowing(ownerPost);
          })
          .catch(error => {
            // Manejar errores si la solicitud falla
            console.error('Error en la solicitud al backend:');
          });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  avatarprofile = (user) => {

    fetch('/api/get_avatar/', {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: user }),

    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ email: data.email })
        this.setState({ avatar: data.avatar })
      })
      .catch((error) => {
        console.error('Error loading more posts:', error);
      });


  }


  handleIsFollowing = (postOwner) => {
    fetch('/api/get_is_user_following/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.state.user, user: postOwner }),
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

  handleDeleteComment = (id) => {

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    fetch('/api/deleteCommentPost/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ post_id: postId, comment_id: id }),
    })
      .then(response => response.json())
      .then(result => {
        window.location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
      });

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
  renderDescription(description) {

    //const urlParams = new URLSearchParams(window.location.search);

    //const description = urlParams.get('description');
    const trimmedDescription = description.trim();
    const { showFullDescription } = this.state;


    if (trimmedDescription !== "") {
      const capitalizedDescription = trimmedDescription.charAt(0).toUpperCase() + trimmedDescription.slice(1);
      const words = capitalizedDescription.split(' ');
      if (words.length > 30 && !showFullDescription) {

        const limitedDescription = words.slice(0, 30).join(' '); // Tomar solo las primeras 100 palabras
        const restDescription = words.slice(30).join(' ');
        const handleShowMore = () => {
          this.setState({ showFullDescription: true });
        };

        return (

          <Text fontSize='2xl'>
            <strong style={{ fontSize: '1em' }}>Description</strong>

            <p style={{ fontSize: '0.7em', maxHeight: showFullDescription ? 'unset' : '100px', overflowY: showFullDescription ? 'auto' : 'hidden' }}>

              {limitedDescription}
              <Button onClick={handleShowMore} style={{ fontSize: '0.7em', border: 'none', background: 'none', color: 'blue', cursor: 'pointer' }}> . . . </Button>

            </p>
          </Text>

        );
      } else {
        const limitedDescription = words.slice(0, 100).join(' '); // Tomar solo las primeras 100 palabras
        return (
          <Box>
            <Text fontSize='2xl' style={{ maxHeight: '200px', overflowY: 'auto' }}>
              <strong style={{ fontSize: '1em' }}>Description</strong>
            </Text>
            <Text fontSize='2xl' style={{ maxHeight: '200px', overflowY: 'auto' }}>

              <p style={{ fontSize: '0.7em' }}>{capitalizedDescription}</p>
            </Text>
          </Box>
        );
      }
    } else {
      return (
        <Box style={styles.boxStyle}>
          <Text fontSize='2xl'>No description added</Text>
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
      <ChakraProvider>
        <div style={{ ...styles.commentsContainer, maxHeight: '200px', overflowY: 'auto', padding: '10px' }}>
          {/* Iterar sobre los comentarios y mostrarlos */}
          {comments.map((comment, index) => (
            <div key={index} style={styles.comment}>
              {/* Avatar del usuario */}

              <Avatar src={'../media/' + comment.avatar} alt={`User ${index + 1}`} style={styles.commentAvatar} />
              {/* Contenido del comentario */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 'calc(100% - 48px)', marginTop: '15px' }}>
                <div>
                  <strong>{comment.user}</strong>
                  <p>{comment.content}</p>
                </div>
                {this.state.user == comment.user && (
                  <IconButton icon={<DeleteIcon />}
                    onClick={() => this.handleDeleteComment(comment.id)}
                    borderRadius='20'
                    variant='ghost'
                    fontSize='15px'
                    style={styles.deleteButton}></IconButton>
                )}

              </div>
            </div>
          ))}

        </div>
      </ChakraProvider>
    );

  };
  handleCommentSubmit = () => {
    const urlParams = new URLSearchParams(window.location.search);

    const id = urlParams.get('id');
    // Enviar el comentario al backend
    fetch('/api/upload_comment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: id, username: this.state.user, comment: this.state.newCommentText,
      }),
    })
      .then(response => response.json())
      .then(result => {
        window.location.reload();
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
    const ownerPost = this.state.postOwner;



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



    const handleReportSubmit = () => {
      const reportData = {
        post_id: id,
        description: reportDescription
      };

      fetch('/api/report_post/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      })
        .then(response => response.json())
        .then(result => {
          if (result.message === 'Report uploaded successfully') {
            Swal.fire({
              icon: 'success',
              title: 'Report sent successfully',
              text: 'Thanks for making Sharing pictures a better place!',
              showCloseButton: true,
              })
          } else {
            // Handle error
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'It seems... ' + result.error,
              showCloseButton: true,
              })

          }
        })
        .catch(error => {
          console.error('Error:', error);

        });
    };

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

                  <IconButton size='lg' borderRadius='30' variant='ghost' icon={<DownloadIcon />} onClick={handleDownload} />
                  <IconButton size='lg' borderRadius='30' variant='ghost' icon={<LinkIcon />} onClick={handleCopyUrl} />
                  <IconButton size='lg' borderRadius='30' variant='ghost' icon={<WarningIcon />} onClick={handleReportSubmit} />

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
                    {this.renderDescription(description)}
                  </Box>

                  <Box>



                    <div div style={styles.imageleft}>


                      {
                        this.state.postOwner === this.state.user ? (
                          <Box />
                        ) : (
                          <Box padding="5%" display="flex" alignItems="center" width="100%">
                            <a href={`/profile/${this.state.postOwner}`}>
                              <Avatar size="md" src={`../media/${this.state.avatar}`} />
                            </a>
                            <strong>{this.state.postOwner}</strong>
                            <Box flex="1" /> {/* Este div se expandirá y empujará el botón hacia la derecha */}
                            <Button
                              borderRadius="30"
                              size="lg"
                              ml="auto"
                              mr="4"
                              onClick={this.toggleFollow}
                              style={{
                                backgroundColor: isFollowing ? 'black' : 'red',
                                color: 'white',
                              }}
                            >
                              {followButtonText}
                            </Button>
                          </Box>
                        )
                      }





                    </div>

                  </Box>
                  {this.renderComments()}
                  {/* Formulario para agregar comentarios */}
                  <div style={styles.commentInput}>
                    <InputGroup size='md'>
                      <Input
                        value={this.state.newCommentText}
                        onChange={this.handleCommentTextChange}
                        placeholder="Add a comment..."
                        style={styles.commentInputField}
                      />
                      <InputRightElement width='4.5rem'>
                        <IconButton
                          onClick={this.handleCommentSubmit}
                          style={styles.commentSendButton}
                          borderRadius='30'
                          variant='ghost'
                          isDisabled={!(this.state.newCommentText.length > 0 && this.state.newCommentText.length <= 100)}
                          icon={<MdSend />}
                        >
                          Enviar
                        </IconButton>
                      </InputRightElement>
                    </InputGroup>
                  </div>
                </Box>

              </Flex>
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
  commentContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 'calc(100% - 48px)', // Ajusta el ancho para alinear el contenido
  },
  deleteButton: {
    // Estilos del botón de eliminar comentario



    padding: '8px 12px', // Espaciado interno del botón

    cursor: 'pointer', // Cambia el cursor al pasar sobre el botón
    marginTop: '8px', // Espacio superior para separar el botón del texto


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
    width: '10px ',
    height: '10px',
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
    borderRadius: '20px',
  },
  commentSendButton: {
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
    display: 'flex',
    flexDirection: 'column',
  },
  comment: {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr', // Columna para el avatar y columna para el texto del comentario
    gridGap: '10px', // Espaciado entre las columnas
    alignItems: 'center', // Alinea verticalmente los elementos en las celdas de la cuadrícula
  },
  commentAvatar: {
    width: '40px', // Ancho del avatar
    height: '40px', // Altura del avatar
  },

  commentText: {
    wordWrap: 'break-word', // Rompe palabras largas para ajustarse al ancho del contenedor
    fontWeight: 'bold'
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