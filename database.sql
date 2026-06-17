--
-- PostgreSQL database dump
--

\restrict rfynesizUo8FveevhyTz4Z60nMz1C8OVkRCMlS2rnj570Fa9kIUcLo2AnHUr9Io

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

-- Started on 2026-06-17 09:46:02

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16391)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 4864 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16530)
-- Name: docentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.docentes (
    docente_id uuid NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    grado_asignado character varying(10),
    seccion_asignada character varying(5)
);


ALTER TABLE public.docentes OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16520)
-- Name: estudiantes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estudiantes (
    estudiante_id uuid NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    grado character varying(10) NOT NULL,
    seccion character varying(5) NOT NULL,
    usuario_id uuid
);


ALTER TABLE public.estudiantes OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16570)
-- Name: evaluaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluaciones (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    respuestas jsonb NOT NULL,
    fecha_evaluacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.evaluaciones OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16541)
-- Name: evaluaciones_catalogo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluaciones_catalogo (
    test_id integer NOT NULL,
    nombre_test character varying(100) NOT NULL,
    descripcion text
);


ALTER TABLE public.evaluaciones_catalogo OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16540)
-- Name: evaluaciones_catalogo_test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluaciones_catalogo_test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluaciones_catalogo_test_id_seq OWNER TO postgres;

--
-- TOC entry 4865 (class 0 OID 0)
-- Dependencies: 221
-- Name: evaluaciones_catalogo_test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluaciones_catalogo_test_id_seq OWNED BY public.evaluaciones_catalogo.test_id;


--
-- TOC entry 224 (class 1259 OID 16569)
-- Name: evaluaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluaciones_id_seq OWNER TO postgres;

--
-- TOC entry 4866 (class 0 OID 0)
-- Dependencies: 224
-- Name: evaluaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluaciones_id_seq OWNED BY public.evaluaciones.id;


--
-- TOC entry 226 (class 1259 OID 24771)
-- Name: personal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal (
    personal_id uuid NOT NULL,
    usuario_id uuid,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL
);


ALTER TABLE public.personal OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16549)
-- Name: resultados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resultados (
    resultado_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    estudiante_id uuid,
    test_id integer,
    respuestas_json jsonb NOT NULL,
    informe_ia text,
    fecha_completado timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    informe_completo_ia text
);


ALTER TABLE public.resultados OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16508)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    usuario_id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    rol character varying(20) NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 4682 (class 2604 OID 16573)
-- Name: evaluaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones ALTER COLUMN id SET DEFAULT nextval('public.evaluaciones_id_seq'::regclass);


--
-- TOC entry 4679 (class 2604 OID 16544)
-- Name: evaluaciones_catalogo test_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones_catalogo ALTER COLUMN test_id SET DEFAULT nextval('public.evaluaciones_catalogo_test_id_seq'::regclass);


--
-- TOC entry 4852 (class 0 OID 16530)
-- Dependencies: 220
-- Data for Name: docentes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.docentes (docente_id, nombres, apellidos, grado_asignado, seccion_asignada) FROM stdin;
\.


--
-- TOC entry 4851 (class 0 OID 16520)
-- Dependencies: 219
-- Data for Name: estudiantes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.estudiantes (estudiante_id, nombres, apellidos, grado, seccion, usuario_id) FROM stdin;
e077a774-ef86-4ba3-af1c-85e1c6a6f324	Juan	Perez	5to	A	bb963a87-a4fe-4fe5-9a3a-52bc58860db8
de5bef1a-4941-4692-8b81-b1532ee5e2e7	Jenny	Atoche burgos	5to	A	89db7ebe-f2b3-4b72-a664-c385dfba0e69
742ff94b-8b6e-4b36-93cd-94265d456de2	William Eduardo	Chero Villarreal	5to	A	82de8829-c304-451d-b6a5-2c25302a5ab5
b55389f2-f6c4-4f6e-9390-651ded099610	Jose	Castillo	5to	C	d366d338-9495-48d3-9144-c18b9ad6f462
\.


--
-- TOC entry 4857 (class 0 OID 16570)
-- Dependencies: 225
-- Data for Name: evaluaciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluaciones (id, estudiante_id, respuestas, fecha_evaluacion) FROM stdin;
\.


--
-- TOC entry 4854 (class 0 OID 16541)
-- Dependencies: 222
-- Data for Name: evaluaciones_catalogo; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluaciones_catalogo (test_id, nombre_test, descripcion) FROM stdin;
1	Test de Orientación Vocacional IA	Evaluación de aptitudes e intereses analizada por Gemini
\.


--
-- TOC entry 4858 (class 0 OID 24771)
-- Dependencies: 226
-- Data for Name: personal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal (personal_id, usuario_id, nombres, apellidos) FROM stdin;
e38b9ac4-c568-4736-aa1d-241825de3c98	f0fbcddc-ad75-4d29-a656-45ae0fd696b8	Jorge Alonso	Sanchez
f12f4901-6950-4122-9fb2-c1d3b40b1bf3	f76ab78a-82e6-4b5b-bb4c-5a4c1f4e3fbd	Keyssi Daleska	Castro Sandoval
758d0a15-d423-476f-a82b-609796848ebc	dbb722fa-64cc-41c3-9d96-cc231d7ab7be	Carlos	More
\.


--
-- TOC entry 4855 (class 0 OID 16549)
-- Dependencies: 223
-- Data for Name: resultados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resultados (resultado_id, estudiante_id, test_id, respuestas_json, informe_ia, fecha_completado, informe_completo_ia) FROM stdin;
61be96ef-a622-4d40-87ed-3665855df7e0	742ff94b-8b6e-4b36-93cd-94265d456de2	1	{"1": "Matemáticas, Física o Química (Cálculo y ciencias exactas).", "2": "Investigando temas nuevos, leyendo o armando estrategias.", "3": "Analizo los datos, busco la lógica y estructuro una solución paso a paso.", "4": "En un laboratorio, clínica o centro de investigación.", "5": "El que investiga a fondo, recopila la información y revisa que todo tenga sentido.", "6": "Economía, negocios, emprendimientos o política local e internacional.", "7": "Hojas de cálculo (Excel), agendas de negocios y gráficos financieros.", "8": "Dar clases de refuerzo a niños o asistir a adultos mayores.", "9": "El servicio: sentir que mi trabajo mejora la vida de mi comunidad.", "10": "Me adapto fácilmente si eso ayuda a que el grupo funcione mejor.", "11": "Para que les arregle la computadora, el internet o algún aparato.", "12": "Escribir un libro o dirigir una película que impacte a millones.", "13": "Viendo un tutorial en video y fijándome en los detalles visuales.", "14": "Soy una persona curiosa, analítica y me gusta llegar al fondo de las cosas."}	"\\u00a1Hola, Estudiante de 5to!\\n\\nEs un gusto para m\\u00ed, como tu orientador vocacional de la I.E. Leonor Cerna de Valdiviezo, acompa\\u00f1arte en esta importante etapa de descubrimiento. He revisado con atenci\\u00f3n tus respuestas en el test vocacional y tus sue\\u00f1os, y me entusiasma ver la claridad y el potencial que demuestras.\\n\\n**An\\u00e1lisis de tu perfil:**\\n\\nTus respuestas revelan un perfil muy interesante y definido. Eres una persona con una marcada inclinaci\\u00f3n hacia las **ciencias exactas** (Matem\\u00e1ticas, F\\u00edsica, Qu\\u00edmica) y un profundo gusto por la **investigaci\\u00f3n, el an\\u00e1lisis l\\u00f3gico y la resoluci\\u00f3n de problemas de manera estructurada**. Te sientes c\\u00f3modo en entornos como laboratorios o centros de investigaci\\u00f3n, donde puedes \\"llegar al fondo de las cosas\\", recopilar informaci\\u00f3n y asegurarte de que todo tenga sentido. Adem\\u00e1s, demuestras un fuerte inter\\u00e9s por la **econom\\u00eda, los negocios y las finanzas**, y valoras el impacto de tu trabajo en la comunidad. Tu habilidad para el an\\u00e1lisis de datos con herramientas como hojas de c\\u00e1lculo y tu curiosidad anal\\u00edtica son puntos muy fuertes. Aunque disfrutas arreglando aparatos, tu perfil apunta m\\u00e1s hacia campos que requieren un pensamiento cr\\u00edtico y una aplicaci\\u00f3n rigurosa del m\\u00e9todo cient\\u00edfico o econ\\u00f3mico.\\n\\n**Opciones de carrera recomendadas para ti en Piura:**\\n\\nConsiderando tus fortalezas y la oferta educativa de nuestra regi\\u00f3n, aqu\\u00ed te presento tres opciones que encajan muy bien con tu perfil:\\n\\n1.  **Ingenier\\u00eda Industrial (Universidad Nacional de Piura - UNP / Universidad de Piura - UDEP / Universidad C\\u00e9sar Vallejo - UCV):**\\n    *   **\\u00bfPor qu\\u00e9 encaja contigo?** Esta carrera es ideal para tu perfil anal\\u00edtico y estrat\\u00e9gico. Combina tus intereses en Matem\\u00e1ticas y F\\u00edsica (Pregunta 1) con tu habilidad para investigar temas nuevos y armar estrategias (Pregunta 2). Te permitir\\u00e1 analizar datos, buscar la l\\u00f3gica y estructurar soluciones paso a paso para optimizar procesos en empresas e instituciones (Pregunta 3, Pregunta 5). Adem\\u00e1s, se alinea con tu inter\\u00e9s en la econom\\u00eda y los negocios (Pregunta 6, Pregunta 7) y, sobre todo, con tu deseo de que tu trabajo mejore la vida de tu comunidad, buscando la eficiencia y el desarrollo (Pregunta 9).\\n\\n2.  **Econom\\u00eda (Universidad Nacional de Piura - UNP / Universidad de Piura - UDEP / Universidad C\\u00e9sar Vallejo - UCV):**\\n    *   **\\u00bfPor qu\\u00e9 encaja contigo?** Tu marcado inter\\u00e9s en la econom\\u00eda, los negocios, los emprendimientos y la pol\\u00edtica (Pregunta 6) es un pilar fundamental para esta carrera. La Econom\\u00eda te permitir\\u00e1 aplicar tus habilidades en Matem\\u00e1ticas y c\\u00e1lculo (Pregunta 1), as\\u00ed como tu capacidad para analizar datos, buscar la l\\u00f3gica y estructurar soluciones (Pregunta 3, Pregunta 5). Har\\u00e1s uso constante de hojas de c\\u00e1lculo y gr\\u00e1ficos financieros (Pregunta 7). Podr\\u00e1s investigar a fondo fen\\u00f3menos econ\\u00f3micos y proponer estrategias que generen un impacto positivo en la vida de tu comunidad y en el desarrollo de la regi\\u00f3n y el pa\\u00eds (Pregunta 9).\\n\\n3.  **Ingenier\\u00eda Qu\\u00edmica (Universidad Nacional de Piura - UNP) / Tecnolog\\u00eda Qu\\u00edmica Industrial (SENATI):**\\n    *   **\\u00bfPor qu\\u00e9 encaja contigo?** Tu afinidad por la Qu\\u00edmica, las Matem\\u00e1ticas y la F\\u00edsica (Pregunta 1), sumada a tu preferencia por trabajar en un laboratorio o centro de investigaci\\u00f3n (Pregunta 4), hacen de esta opci\\u00f3n un excelente camino. Aqu\\u00ed podr\\u00e1s investigar a fondo (Pregunta 2, Pregunta 5), analizar datos y aplicar la l\\u00f3gica para resolver problemas en la industria (Pregunta 3). La Ingenier\\u00eda Qu\\u00edmica te ofrece una ruta universitaria para desarrollar procesos y productos, mientras que la Tecnolog\\u00eda Qu\\u00edmica Industrial de SENATI te capacitar\\u00e1 con habilidades t\\u00e9cnicas pr\\u00e1cticas para operar y optimizar procesos qu\\u00edmicos en la industria local. Ambas opciones te permitir\\u00e1n aplicar tu curiosidad y an\\u00e1lisis para llegar al fondo de las transformaciones de la materia.\\n\\n**Mensaje final:**\\n\\nEstudiante de 5to, tienes un perfil muy s\\u00f3lido y prometedor, con una mente anal\\u00edtica y una clara orientaci\\u00f3n hacia la investigaci\\u00f3n y la soluci\\u00f3n de problemas. Recuerda que estas recomendaciones son un punto de partida para que explores y profundices. Piura cuenta con excelentes instituciones que pueden ayudarte a desarrollar tu potencial. Te animo a investigar m\\u00e1s sobre estas carreras, visitar las universidades e institutos, y conversar con profesionales de estos campos. \\u00a1Tu futuro profesional en Piura es brillante y est\\u00e1 esperando ser construido con tu curiosidad y tu capacidad de an\\u00e1lisis! \\u00a1Conf\\u00eda en ti y sigue adelante!"	2026-06-14 13:24:48.096765	\N
d762e7ed-14e2-4063-a1a5-6716ac33c79d	742ff94b-8b6e-4b36-93cd-94265d456de2	1	{"1": "Matemáticas, Física o Química (Cálculo y ciencias exactas).", "2": "Investigando temas nuevos, leyendo o armando estrategias.", "3": "Busco una forma creativa, diferente o 'fuera de la caja' para resolverlo.", "4": "En un laboratorio, clinic o centro de investigación.", "5": "El que diseña las diapositivas, hace la carátula y le da el toque visual.", "6": "Descubrimientos científicos, avances médicos o documentales de naturaleza.", "7": "Una cámara profesional, un lienzo o un programa de diseño gráfico.", "8": "Ayudar en la logística, administrando las donaciones y el presupuesto.", "9": "El descubrimiento: poder investigar y encontrar verdades o curas.", "10": "Me encantan; prefiero tener instrucciones claras, orden y saber qué esperar.", "11": "Para pedirme un consejo personal o porque sé escuchar muy bien.", "12": "Escribir un libro o dirigir una película que impacte a millones.", "13": "Leyendo el manual completo antes de tocar cualquier pieza.", "14": "Soy una persona curiosa, analítica y me gusta llegar al fondo de las cosas."}	"\\u00a1Hola, Estudiante de 5to!\\n\\nEs un gusto para m\\u00ed, como tu orientador vocacional de la I.E. Leonor Cerna de Valdiviezo, analizar tus respuestas y acompa\\u00f1arte en este emocionante camino de descubrimiento hacia tu futuro profesional. \\u00a1Tienes un perfil muy interesante y con mucho potencial!\\n\\n**An\\u00e1lisis de tu perfil vocacional:**\\n\\nBasado en tus respuestas, podemos ver que eres una persona con una marcada inclinaci\\u00f3n hacia las **ciencias exactas y la investigaci\\u00f3n**. Te sientes c\\u00f3modo con materias como Matem\\u00e1ticas, F\\u00edsica y Qu\\u00edmica, y disfrutas profundamente la idea de investigar temas nuevos, llegar al fondo de las cosas y buscar descubrimientos cient\\u00edficos o avances que generen un impacto. Tu preferencia por los laboratorios, cl\\u00ednicas y centros de investigaci\\u00f3n, junto con tu curiosidad y mente anal\\u00edtica, se\\u00f1alan una fuerte vocaci\\u00f3n por la exploraci\\u00f3n del conocimiento y la resoluci\\u00f3n de problemas de manera estructurada y met\\u00f3dica, como lo demuestra tu gusto por las instrucciones claras y la lectura de manuales completos.\\n\\nSin embargo, tu perfil va m\\u00e1s all\\u00e1 de lo puramente cient\\u00edfico. Tambi\\u00e9n demuestras una sorprendente **vena creativa y un ojo para lo visual y est\\u00e9tico**. Te inclinas por resolver problemas de forma \\"fuera de la caja\\", disfrutas dise\\u00f1ando y d\\u00e1ndole un toque visual a tus trabajos, y te atraen herramientas como c\\u00e1maras profesionales, lienzos o programas de dise\\u00f1o. Adem\\u00e1s, tu deseo de escribir un libro o dirigir una pel\\u00edcula que impacte a millones, junto con tu capacidad para escuchar y dar consejos, revela una personalidad con un fuerte deseo de comunicar, crear y generar una influencia positiva en tu entorno.\\n\\nEn resumen, eres un pensador anal\\u00edtico, investigador nato, con una mente creativa y un gran sentido del orden, que busca aplicar sus conocimientos para descubrir, innovar y generar un impacto significativo.\\n\\n**Opciones de Carrera Recomendadas para ti en Piura:**\\n\\nConsiderando tu valioso perfil y la oferta educativa de nuestra regi\\u00f3n, aqu\\u00ed te presento tres opciones que podr\\u00edan resonar contigo:\\n\\n1.  **Medicina Humana (Universidad Nacional de Piura - UNP, Universidad de Piura - UDEP, Universidad C\\u00e9sar Vallejo - UCV):** Esta carrera se alinea perfectamente con tu inter\\u00e9s en las ciencias exactas (Pregunta 1), tu preferencia por trabajar en cl\\u00ednicas y centros de investigaci\\u00f3n (Pregunta 4), tu fascinaci\\u00f3n por los avances m\\u00e9dicos y el descubrimiento de curas (Preguntas 6 y 9). Tu naturaleza curiosa y anal\\u00edtica (Pregunta 14), junto con tu deseo de generar un impacto y tu capacidad para escuchar (Pregunta 11), son cualidades esenciales para un m\\u00e9dico. Aunque no es directamente \\"visual\\", la medicina moderna requiere mucha interpretaci\\u00f3n visual (im\\u00e1genes diagn\\u00f3sticas, anatom\\u00eda) y un enfoque creativo para el diagn\\u00f3stico y tratamiento.\\n\\n2.  **Arquitectura (Universidad Nacional de Piura - UNP, Universidad de Piura - UDEP, Universidad C\\u00e9sar Vallejo - UCV):** Esta es una excelente opci\\u00f3n que fusiona tu lado anal\\u00edtico con tu inclinaci\\u00f3n creativa. La Arquitectura requiere una s\\u00f3lida base en Matem\\u00e1ticas y F\\u00edsica (Pregunta 1), te permite aplicar una forma creativa y \\"fuera de la caja\\" para resolver desaf\\u00edos de dise\\u00f1o (Pregunta 3), y explota tu habilidad para el dise\\u00f1o visual y est\\u00e9tico (Preguntas 5 y 7). Adem\\u00e1s, tu preferencia por la planificaci\\u00f3n, el orden y las instrucciones claras (Preguntas 10 y 13) son fundamentales en esta disciplina, y tu deseo de impactar a millones (Pregunta 12) se puede lograr a trav\\u00e9s de la creaci\\u00f3n de espacios y ciudades que beneficien a la sociedad.\\n\\n3.  **Ingenier\\u00eda Qu\\u00edmica (Universidad Nacional de Piura - UNP):** Esta carrera es ideal para tu esp\\u00edritu investigador y tu afinidad por las ciencias exactas. La Ingenier\\u00eda Qu\\u00edmica se basa fuertemente en Matem\\u00e1ticas, F\\u00edsica y Qu\\u00edmica (Pregunta 1), te permite trabajar en laboratorios y centros de investigaci\\u00f3n (Pregunta 4) para realizar descubrimientos cient\\u00edficos y desarrollar soluciones innovadoras (Preguntas 6 y 9). Tu mente curiosa, anal\\u00edtica y met\\u00f3dica (Preguntas 13 y 14), que busca llegar al fondo de las cosas y prefiere el orden y las instrucciones claras (Pregunta 10), encontrar\\u00e1 un ambiente propicio para florecer. Es una carrera que constantemente busca formas creativas de optimizar procesos y materiales (Pregunta 3).\\n\\nEstudiante de 5to, tienes un perfil multifac\\u00e9tico y un gran potencial para destacarte en Piura. Recuerda que el camino que elijas debe apasionarte y alinearse con tus talentos. No tengas miedo de explorar estas opciones y de seguir cultivando tu curiosidad, tu pensamiento anal\\u00edtico y tu creatividad. \\u00a1El futuro est\\u00e1 lleno de posibilidades y estoy seguro de que lograr\\u00e1s grandes cosas en nuestra regi\\u00f3n!\\n\\n\\u00a1Mucho \\u00e9xito en esta etapa tan importante!"	2026-06-14 13:31:37.968213	\N
16cc60dc-7d2a-4215-9e27-ce80c80c64b3	de5bef1a-4941-4692-8b81-b1532ee5e2e7	1	{"1": "Matemáticas, Física o Química (Cálculo y ciencias exactas).", "2": "Dibujando, tocando un instrumento, escribiendo o creando contenido.", "3": "Busco una forma creativa, diferente o 'fuera de la caja' para resolverlo.", "4": "En un estudio de diseño, teatro, o viajando constantemente.", "5": "El que diseña las diapositivas, hace la carátula y le da el toque visual.", "6": "Economía, negocios, emprendimientos o política local e internacional.", "7": "Una cámara profesional, un lienzo o un programa de diseño gráfico.", "8": "Diseñar los afiches y las campañas de publicidad para redes sociales.", "9": "El liderazgo y éxito económico: dirigir proyectos grandes y ganar bien.", "10": "Me frustran un poco; prefiero la flexibilidad y hacer las cosas a mi modo.", "11": "Para pedirme un consejo personal o porque sé escuchar muy bien.", "12": "Escribir un libro o dirigir una película que impacte a millones.", "13": "Viendo un tutorial en video y fijándome en los detalles visuales.", "14": "Soy una persona creativa, original y muy conectada con mis emociones."}	{"saludo": "\\u00a1Hola, Jenny! Es un gusto para m\\u00ed analizar tus respuestas y acompa\\u00f1arte en este importante proceso de orientaci\\u00f3n vocacional aqu\\u00ed en la I.E. Leonor Cerna de Valdiviezo.", "perfil": "Jenny, tus respuestas revelan un perfil vibrante y multifac\\u00e9tico, con una clara inclinaci\\u00f3n hacia la creatividad, el dise\\u00f1o y la comunicaci\\u00f3n. Destacas por tu pensamiento 'fuera de la caja' y tu habilidad para encontrar soluciones innovadoras. Te sientes c\\u00f3moda creando contenido, dibujando y d\\u00e1ndole un toque visual distintivo a todo lo que haces. Muestras un fuerte inter\\u00e9s en el mundo de los negocios, la econom\\u00eda y el emprendimiento, buscando roles de liderazgo y \\u00e9xito econ\\u00f3mico, lo que indica ambici\\u00f3n y visi\\u00f3n de futuro. Prefieres la flexibilidad y la autonom\\u00eda en tus proyectos, y te ves trabajando en entornos din\\u00e1micos como estudios de dise\\u00f1o o viajando. Adem\\u00e1s, posees una gran capacidad de escucha y empat\\u00eda, lo que complementa tu deseo de generar un impacto significativo a trav\\u00e9s de tus creaciones, ya sea escribiendo o dirigiendo proyectos a gran escala. Tu aprendizaje es muy visual y te fijas en los detalles est\\u00e9ticos, lo cual es una fortaleza en campos creativos.", "carreras_sugeridas": [{"titulo": "Ciencias de la Comunicaci\\u00f3n con \\u00e9nfasis en Publicidad y Marketing (Universidad de Piura - UDEP / Universidad Nacional de Piura - UNP / Universidad C\\u00e9sar Vallejo - UCV)", "descripcion": "Esta carrera encaja perfectamente con tu deseo de crear contenido, dise\\u00f1ar campa\\u00f1as de publicidad para redes sociales, y darle un toque visual a los proyectos (P2, P5, P8). Te permitir\\u00e1 desarrollar tu pensamiento creativo y original (P3, P14), y aplicar tu inter\\u00e9s en negocios y emprendimientos (P6) para dirigir proyectos que busquen impactar a millones (P12). Adem\\u00e1s, te brindar\\u00e1 la flexibilidad y el dinamismo que buscas en tu ambiente de trabajo (P4, P10)."}, {"titulo": "Dise\\u00f1o Gr\\u00e1fico (Universidad C\\u00e9sar Vallejo - UCV / SENATI)", "descripcion": "Si tu pasi\\u00f3n es el arte visual y la creaci\\u00f3n, esta opci\\u00f3n es ideal. Aqu\\u00ed podr\\u00e1s explotar tu habilidad para dibujar (P2), dise\\u00f1ar diapositivas y car\\u00e1tulas (P5), y utilizar herramientas como c\\u00e1maras profesionales o programas de dise\\u00f1o gr\\u00e1fico (P7). Es un campo que valora la creatividad, la originalidad (P14) y la resoluci\\u00f3n de problemas de forma 'fuera de la caja' (P3). SENATI ofrece una formaci\\u00f3n t\\u00e9cnica muy pr\\u00e1ctica, mientras que la UCV te brinda una perspectiva universitaria m\\u00e1s amplia, ambas en l\\u00ednea con tu aprendizaje visual (P13)."}, {"titulo": "Arquitectura (Universidad Nacional de Piura - UNP / Universidad de Piura - UDEP / Universidad C\\u00e9sar Vallejo - UCV)", "descripcion": "Considerando tu inter\\u00e9s en las matem\\u00e1ticas y ciencias exactas (P1), combinado con tu marcada creatividad, dise\\u00f1o visual (P2, P5, P7, P13) y tu deseo de dirigir proyectos grandes con impacto (P9, P12), Arquitectura podr\\u00eda ser una excelente opci\\u00f3n. Esta carrera te permite resolver problemas de forma creativa (P3) y plasmar tu visi\\u00f3n en obras concretas, equilibrando la l\\u00f3gica con la est\\u00e9tica. Te ofrece un camino para el liderazgo y el \\u00e9xito econ\\u00f3mico, creando espacios que impacten a muchas personas."}], "conclusiones": "Jenny, tienes un perfil muy completo, con una combinaci\\u00f3n poderosa de creatividad, visi\\u00f3n de negocios y habilidades interpersonales. Las opciones que te presento en Piura te permitir\\u00e1n desarrollar al m\\u00e1ximo tus talentos y alcanzar tus sue\\u00f1os. Te animo a investigar m\\u00e1s a fondo cada una de estas carreras en las instituciones mencionadas, visitar sus campus si es posible, y conversar con profesionales de estos campos. Recuerda que el camino que elijas debe apasionarte y permitirte expresarte plenamente. \\u00a1Conf\\u00edo en tu capacidad para construir un futuro exitoso y lleno de impacto aqu\\u00ed en nuestra regi\\u00f3n Piura!"}	2026-06-14 15:40:52.232808	\N
\.


--
-- TOC entry 4850 (class 0 OID 16508)
-- Dependencies: 218
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (usuario_id, email, password_hash, rol, fecha_registro) FROM stdin;
bb963a87-a4fe-4fe5-9a3a-52bc58860db8	alumno50@test.com	$2b$12$ModFfq19JiPmqNmIN3KjNezVN0CzYf1MRFd5uch2kNZ39p51rjH0u	alumno	2026-06-04 20:55:49.251791
89db7ebe-f2b3-4b72-a664-c385dfba0e69	burgos@leonorcerna.com	$2b$12$JtwTk7BcS20dxt0m4Qey0e.dy1U2QPj1EQBovRyZdWYdobtzmW7FS	alumno	2026-06-04 21:35:51.25789
82de8829-c304-451d-b6a5-2c25302a5ab5	chero@leonorcerna.edu.pe	$2b$12$NoYyCgq2CcGc/mPzdpJzN.ApQE3FcJUkAyd1wADDgQZEuqVu6pqU.	alumno	2026-06-07 11:52:06.054886
f0fbcddc-ad75-4d29-a656-45ae0fd696b8	sanchez@leonorcerna.com	$2b$12$QNtbZNl3EM/kgI79zjmEDuUNf0awoOu6Y9owYovFCPzn2sb6zD3Ny	psicologo	2026-06-12 18:09:47.126186
f76ab78a-82e6-4b5b-bb4c-5a4c1f4e3fbd	daleska@gmail.com	$2b$12$/czprrUcpoMu340xIqrfNen0yNtviU1hp1x8iD7VBd.R6so7X2sHW	psicologo	2026-06-12 18:25:45.212068
dbb722fa-64cc-41c3-9d96-cc231d7ab7be	morecarlos@leonorcerna.com	$2b$12$jGyPcrXMxeMajXhq7FlFCO/yhTMRe0ifZML1Gp5IS44BnlJTzY/3S	admin	2026-06-12 18:27:10.085269
d366d338-9495-48d3-9144-c18b9ad6f462	castillo@leonorcerna.com	$2b$12$FIA6AV7R7u/pi5YOiFdIReqN0ybPcvGEIwXys7VC51ZUSM4aYejj.	alumno	2026-06-12 20:23:18.841365
\.


--
-- TOC entry 4867 (class 0 OID 0)
-- Dependencies: 221
-- Name: evaluaciones_catalogo_test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluaciones_catalogo_test_id_seq', 1, false);


--
-- TOC entry 4868 (class 0 OID 0)
-- Dependencies: 224
-- Name: evaluaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluaciones_id_seq', 1, false);


--
-- TOC entry 4691 (class 2606 OID 16534)
-- Name: docentes docentes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_pkey PRIMARY KEY (docente_id);


--
-- TOC entry 4689 (class 2606 OID 16524)
-- Name: estudiantes estudiantes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (estudiante_id);


--
-- TOC entry 4693 (class 2606 OID 16548)
-- Name: evaluaciones_catalogo evaluaciones_catalogo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones_catalogo
    ADD CONSTRAINT evaluaciones_catalogo_pkey PRIMARY KEY (test_id);


--
-- TOC entry 4697 (class 2606 OID 16578)
-- Name: evaluaciones evaluaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluaciones
    ADD CONSTRAINT evaluaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4699 (class 2606 OID 24775)
-- Name: personal personal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_pkey PRIMARY KEY (personal_id);


--
-- TOC entry 4695 (class 2606 OID 16557)
-- Name: resultados resultados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados
    ADD CONSTRAINT resultados_pkey PRIMARY KEY (resultado_id);


--
-- TOC entry 4685 (class 2606 OID 16519)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4687 (class 2606 OID 16517)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (usuario_id);


--
-- TOC entry 4701 (class 2606 OID 16535)
-- Name: docentes docentes_docente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.docentes
    ADD CONSTRAINT docentes_docente_id_fkey FOREIGN KEY (docente_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 4700 (class 2606 OID 16579)
-- Name: estudiantes fk_estudiantes_usuarios; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT fk_estudiantes_usuarios FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id);


--
-- TOC entry 4704 (class 2606 OID 24776)
-- Name: personal personal_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(usuario_id) ON DELETE CASCADE;


--
-- TOC entry 4702 (class 2606 OID 16558)
-- Name: resultados resultados_estudiante_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados
    ADD CONSTRAINT resultados_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(estudiante_id) ON DELETE CASCADE;


--
-- TOC entry 4703 (class 2606 OID 16563)
-- Name: resultados resultados_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados
    ADD CONSTRAINT resultados_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.evaluaciones_catalogo(test_id);


-- Completed on 2026-06-17 09:46:02

--
-- PostgreSQL database dump complete
--

\unrestrict rfynesizUo8FveevhyTz4Z60nMz1C8OVkRCMlS2rnj570Fa9kIUcLo2AnHUr9Io

