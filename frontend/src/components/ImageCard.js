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

function extractHashtagsAndDescriptionFromURL() {
  // Obtener la descripción y los hashtags de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const descriptionWithoutHashtags = urlParams.get('description');
  const hashtags = urlParams.getAll('hashtags'); // Utilizamos getAll para obtener todos los valores para la clave 'hashtags'

  // Vuelve a unir los hashtags con la descripción sin hashtags
  const descriptionWithHashtags = descriptionWithoutHashtags + ' ' + hashtags.map(tag => `#${tag}`).join(' ');

  return {
    descriptionWithHashtags,
    hashtags,
  };
}
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

    };

    this.imageRef = React.createRef();
  }

  componentDidMount() {
    // Obtenemos la altura de la imagen una vez que esté cargada
    this.imageRef.current.onload = () => {
      const height = this.imageRef.current.clientHeight;
      this.setState({ imageHeight: height });
    };
  }

  toggleFollow = () => {
    this.callBackendToggleFollow();
    this.setState((prevState) => ({
      isFollowing: !prevState.isFollowing,
    }));
  };
  callBackendToggleFollow = () => {
    // Realiza la llamada al backend aquí
    // Puedes usar axios para hacer una solicitud POST o GET al servidor

    axios.post('/api/follow/<str:pk>', { userId: 'ID_DEL_USUARIO' })

      .then(response => {
        // Manejar la respuesta del servidor si es necesario
        console.log('Backend response:', response.data);
      })
      .catch(error => {
        // Manejar errores si la solicitud falla
        console.error('Error en la solicitud al backend:', error);
      });
  };

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
    console.log(descriptionWithHashtags)
    if (descriptionWithHashtags && descriptionWithHashtags.trim() !== "") {
      const words = descriptionWithHashtags.split(' ');
      console.log(descriptionWithHashtags)
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


  render() {
    const { imageHeight, isReporting, reportReason, reportDescription, reportSubmitted } = this.state;
    const { isLarge } = this.props;
    const urlParams = new URLSearchParams(window.location.search);
    const size = urlParams.get('size');
    const image = urlParams.get('image');
    const description = urlParams.get('description');
    const { descriptionWithHashtags, hashtags } = extractHashtagsAndDescriptionFromURL();
    console.log(description)
    const { isFollowing } = this.state;
    const followButtonText = isFollowing ? 'Seguint' : 'Seguir';
    const { isLiked } = this.state;



    const handleDownload = () => {
      console.log(this.imageRef);
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
                  <Box >
                    <IconButton size='lg' borderRadius='30' variant='ghost' icon={<DownloadIcon />} onClick={handleDownload} />
                  </Box>
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
