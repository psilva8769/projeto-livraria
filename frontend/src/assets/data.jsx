import fiction from "./categories/fiction.png";
import children from "./categories/children.png";
import health from "./categories/health.png";
import business from "./categories/business.png";
import academic from "./categories/academic.png";
import religious from "./categories/religious.png";
import fiction from "../assets/categories/fiction.png";
import children from "../assets/categories/children.png";
import health from "../assets/categories/health.png";
import business from "../assets/categories/business.png";
import academic from "../assets/categories/academic.png";
import religious from "../assets/categories/religious.png";


import book_1 from './book_1.png'
import book_2 from './book_2.png'
import book_3 from './book_3.png'
import book_4 from './book_4.png'
import book_5 from './book_5.png'
import book_6 from './book_6.png'
import book_7 from './book_7.png'
import book_8 from './book_8.png'
import book_9 from './book_9.png'
import book_10 from './book_10.png'
import book_11 from './book_11.png'
import book_12 from './book_12.png'
import book_13 from './book_13.png'
import book_14 from './book_14.png'
import book_15 from './book_15.png'
import book_16 from './book_16.png'
import book_17 from './book_17.png'
import book_18 from './book_18.png'
import book_19 from './book_19.png'
import book_20 from './book_20.png'
import book_21 from './book_21.png'
import book_22 from './book_22.png'
import book_23 from './book_23.png'
import book_24 from './book_24.png'
import book_25 from './book_25.png'
import book_26 from './book_26.png'
import book_27 from './book_27.png'
import book_28 from './book_28.png'
import book_29 from './book_29.png'
import book_30 from './book_30.png'
import book_31 from './book_31.png'
import book_32 from './book_32.png'
import book_33 from './book_33.png'
import book_34 from './book_34.png'
import book_35 from './book_35.png'
import book_36 from './book_36.png'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa6";

export const categories = [
    {
        name: "Ficção",
        image: fiction,
    },
    {
        name: "Infantil",
        image: children,
    },
    {
        name: "Saúde",
        image: health,
    },
    {
        name: "Acadêmico",
        image: academic,
    },
    {
        name: "Negócios",
        image: business,
    },
    {
        name: "Religioso",
        image: religious,
    },
];

export const books = [
    // Ficção
    {
        _id: "1",
        name: "A Grande Fuga",
        image: book_1,
        price: 15,
        description: "Mergulhe em uma emocionante história de aventura e coragem.",
        category: "Ficção",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "2",
        name: "Sombras do Passado",
        image: book_2,
        price: 20,
        description: "Desvende segredos escondidos em uma floresta misteriosa.",
        category: "Ficção",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "3",
        name: "Amor Eterno",
        image: book_3,
        price: 10,
        description: "Um romance emocionante que transcende o tempo e o espaço.",
        category: "Ficção",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "4",
        name: "A Jornada do Viajante do Tempo",
        image: book_4,
        price: 25,
        description: "Embarque em uma viagem no tempo para salvar a humanidade.",
        category: "Ficção",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "5",
        name: "Contos Místicos",
        image: book_5,
        price: 15,
        description: "Uma coletânea de histórias encantadoras e cheias de magia.",
        category: "Ficção",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "6",
        name: "No Desconhecido",
        image: book_6,
        price: 18,
        description: "Uma saga envolvente de sobrevivência em terras inexploradas.",
        category: "Ficção",
        date: 1716634345448,
        popular: true,
    },

    // Infantil
    {
        _id: "7",
        name: "Aventuras na Terra dos Brinquedos",
        image: book_7,
        price: 12,
        description: "Acompanhe um grupo de brinquedos em aventuras mágicas.",
        category: "Infantil",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "8",
        name: "Os Animais Falantes",
        image: book_8,
        price: 14,
        description: "Uma história encantadora sobre animais que compartilham sua sabedoria.",
        category: "Infantil",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "9",
        name: "A Princesa da Floresta Encantada",
        image: book_9,
        price: 18,
        description: "Um conto mágico de coragem e bondade em um reino de fadas.",
        category: "Infantil",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "10",
        name: "João e a Grande Aventura do Gigante",
        image: book_10,
        price: 20,
        description: "Uma jornada emocionante para enganar um gigante e encontrar um tesouro.",
        category: "Infantil",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "11",
        name: "O Mapa do Tesouro Perdido",
        image: book_11,
        price: 15,
        description: "Siga o mapa e descubra um tesouro escondido.",
        category: "Infantil",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "12",
        name: "Exploradores da Galáxia",
        image: book_12,
        price: 17,
        description: "Junte-se a crianças em uma aventura emocionante no espaço.",
        category: "Infantil",
        date: 1716634345448,
        popular: true,
    },

    // Saúde
    {
        _id: "13",
        name: "A Mente Saudável",
        image: book_13,
        price: 20,
        description: "Explore técnicas para manter sua mente afiada e focada.",
        category: "Saúde",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "14",
        name: "Yoga para Iniciantes",
        image: book_14,
        price: 18,
        description: "Aprenda posturas de yoga para o bem-estar físico e mental.",
        category: "Saúde",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "15",
        name: "Nutrição Descomplicada",
        image: book_15,
        price: 15,
        description: "Entenda o básico de uma alimentação equilibrada e saudável.",
        category: "Saúde",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "16",
        name: "O Poder do Sono",
        image: book_16,
        price: 22,
        description: "Descubra a importância do sono para uma vida mais saudável.",
        category: "Saúde",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "17",
        name: "Em Forma em 30 Dias",
        image: book_17,
        price: 25,
        description: "Seu guia para ficar em forma com treinos rápidos.",
        category: "Saúde",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "18",
        name: "Cura com a Natureza",
        image: book_18,
        price: 18,
        description: "Aprenda como a natureza contribui para o bem-estar mental.",
        category: "Saúde",
        date: 1716634345448,
        popular: false,
    },

    // Acadêmico
    {
        _id: "19",
        name: "Introdução à Física",
        image: book_19,
        price: 30,
        description: "Um guia completo sobre conceitos básicos de física.",
        category: "Acadêmico",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "20",
        name: "Matemática Simplificada",
        image: book_20,
        price: 25,
        description: "Simplifique conceitos matemáticos complexos com explicações fáceis.",
        category: "Acadêmico",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "21",
        name: "História do Mundo Moderno",
        image: book_21,
        price: 18,
        description: "Explore os principais eventos que moldaram a era moderna.",
        category: "Acadêmico",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "22",
        name: "Experiências de Química para Iniciantes",
        image: book_22,
        price: 22,
        description: "Experimentos práticos para entender o básico da química.",
        category: "Acadêmico",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "23",
        name: "A Arte da Programação",
        image: book_23,
        price: 28,
        description: "Um guia passo a passo para programação e resolução de problemas.",
        category: "Acadêmico",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "24",
        name: "Explorando o Universo",
        image: book_24,
        price: 30,
        description: "Uma imersão em astronomia e exploração espacial.",
        category: "Acadêmico",
        date: 1716634345448,
        popular: false,
    },

    // Negócios
    {
        _id: "25",
        name: "Empreendedorismo 101",
        image: book_25,
        price: 22,
        description: "Aprenda o básico para iniciar e administrar um negócio.",
        category: "Negócios",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "26",
        name: "Estratégias de Marketing",
        image: book_26,
        price: 24,
        description: "Técnicas comprovadas para marketing e branding eficazes.",
        category: "Negócios",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "27",
        name: "Liderança para o Sucesso",
        image: book_27,
        price: 26,
        description: "Habilidades e estratégias essenciais para ser um grande líder.",
        category: "Negócios",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "28",
        name: "Finanças para Iniciantes",
        image: book_28,
        price: 18,
        description: "Entenda o básico das finanças pessoais e corporativas.",
        category: "Negócios",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "29",
        name: "A Arte da Negociação",
        image: book_29,
        price: 22,
        description: "Aprenda a negociar de forma eficaz em qualquer situação.",
        category: "Negócios",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "30",
        name: "Mestre da Gestão do Tempo",
        image: book_30,
        price: 20,
        description: "Dicas práticas para gerenciar o tempo e aumentar a produtividade.",
        category: "Negócios",
        date: 1716634345448,
        popular: true,
    },
    // Religioso
    {
        _id: "31",
        name: "O Caminho para a Iluminação",
        image: book_31,
        price: 15,
        description: "Explore ensinamentos que conduzem à paz espiritual.",
        category: "Religioso",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "32",
        name: "Histórias do Livro",
        image: book_32,
        price: 18,
        description: "Uma coletânea de histórias inspiradoras do livro.",
        category: "Religioso",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "33",
        name: "O Poder da Oração",
        image: book_33,
        price: 12,
        description: "Descubra os efeitos transformadores da oração sincera.",
        category: "Religioso",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "34",
        name: "A Vida do Homem",
        image: book_34,
        price: 20,
        description: "Uma biografia reveladora.",
        category: "Religioso",
        date: 1716634345448,
        popular: true,
    },
    {
        _id: "35",
        name: "Compreendendo o Religioso",
        image: book_35,
        price: 22,
        description: "Aprenda o significado dos melhores ensinamentos.",
        category: "Religioso",
        date: 1716634345448,
        popular: false,
    },
    {
        _id: "36",
        name: "Sabedoria Espiritual",
        image: book_36,
        price: 25,
        description: "Lições atemporais para o crescimento pessoal e espiritual.",
        category: "Religioso",
        date: 1716634345448,
        popular: true,
    },
];

export const FOOTER_LINKS = [
    {
      title: "Saiba Mais",
      links: [
        "Sobre Nós",
        "Últimos livros",
        "Ofertas Especiais",
        "Livros Populares",
        "Perguntas Frequentes",
        "Política de Privacidade",
      ],
    },
    {
      title: "Nossa Comunidade",
      links: [
        "Termos e Condições",
        "Ofertas Especiais",
        "Avaliações de Clientes",
      ],
    },
];

export const FOOTER_CONTACT_INFO = {
    title: "Fale Conosco",
    links: [
      { label: "Telefone", value: "123-456-7890" },
      { label: "E-mail", value: "info@bacala.com" },
    ],
};

export const SOCIALS = {
    title: "Redes Sociais",
    links: [
      { icon: <FaFacebook />, id: "facebook" },
      { icon: <FaInstagram />, id: "instagram" },
      { icon: <FaTwitter />, id: "twitter" },
      { icon: <FaYoutube />, id: "youtube" },
      { icon: <FaLinkedin />, id: "linkedin" },
    ],
};
