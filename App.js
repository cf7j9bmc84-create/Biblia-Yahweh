import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView, Alert, Modal } from 'react-native';
import { BIBLIA, LIBROS } from './datos/bibliaCompleta';

const DICCIONARIO = {
  "Jesús": "Yahushua", "Jesucristo": "Yahushua HaMashíaj", "Cristo": "Mashíaj", "Mesías": "Mashíaj",
  "Pedro": "Kefas", "Juan": "Yojanán", "Mateo": "Matityahu", "Lucas": "Lukas",
  "Marcos": "Yojanán Marcos", "Pablo": "Shaúl", "María": "Miryam", "José": "Yosef",
  "David": "Dawid", "Moisés": "Moshe", "Abraham": "Avraham", "Isaac": "Yitzjak",
  "Jacob": "Yaakov", "Josué": "Yehoshúa", "Samuel": "Shemu'el", "Elías": "Eliyahu",
  "Isaías": "Yeshayahu", "Jeremías": "Yirmeyahu", "Ezequiel": "Yejezquel", "Daniel": "Dani'el",
  "Nehemías": "Nejemyah", "Esdras": "Ezra", "Job": "Iyov", "Salomón": "Shlomó",
  "Santiago": "Yaakov", "Andrés": "Andreas", "Felipe": "Filipos", "Tomás": "T'oma",
  "Judas": "Yehudah", "Simón": "Shimón", "Jerusalén": "Yerushalayim", "Israel": "Yisra'el",
  "Egipto": "Mitzrayim", "Babilonia": "Bavel", "Galilea": "HaGalil", "Samaria": "Shomrón",
  "Judea": "Yehudah", "Belén": "Beit Lejem", "Nazaret": "Natzeret", "Canaán": "Kena'an",
  "Sinaí": "Sinai", "Sión": "Tzion", "Señor": "Adonai", "Dios": "Elohim",
  "Señor Dios": "Adonai Elohim", "Salvador": "Moshia", "Espíritu Santo": "Ruaj HaKodesh",
  "Hijo": "Ben", "Hijo de Dios": "Ben Elohim", "Rey": "Melej", "Profeta": "Navi",
  "Sacerdote": "Kohen", "Ángel": "Mal'aj", "Apóstol": "Shali'aj", "Evangelio": "Besorah",
  "Gracia": "Jesed", "Verdad": "Emet", "Paz": "Shalom", "Justicia": "Tzedek",
  "Misericordia": "Rajamim", "Fe": "Emunah", "Esperanza": "Tikvá", "Amor": "Ahavá",
  "Alabanza": "Tehilá", "Gloria": "Kavod", "Padre Nuestro": "Avinu Shebashamayim",
  "Hijo del Hombre": "Ben Adam", "Rey de Reyes": "Melej HaMelajim", "Señor de Señores": "Adonai HaAdonim"
};

function reemplazarNombres(texto) {
  let resultado = texto;
  const nombres = Object.keys(DICCIONARIO).sort((a, b) => b.length - a.length);
  for (const nombre of nombres) {
    const hebreo = DICCIONARIO[nombre];
    const regex = new RegExp(`\\b${nombre}\\b`, 'gi');
    resultado = resultado.replace(regex, (match) => {
      if (match[0] === match[0].toUpperCase()) {
        return hebreo.charAt(0).toUpperCase() + hebreo.slice(1);
      }
      return hebreo;
    });
  }
  return resultado;
}

export default function App() {
  const [libroSeleccionado, setLibroSeleccionado] = useState('Juan');
  const [capitulo, setCapitulo] = useState('3');
  const [versiculo, setVersiculo] = useState('16');
  const [textoMostrado, setTextoMostrado] = useState([]);
  const [referenciaMostrada, setReferenciaMostrada] = useState('');
  const [cargando, setCargando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modoBusqueda, setModoBusqueda] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);

  useEffect(() => { cargarVersiculo('Juan', '3', '16'); }, []);

  const cargarVersiculo = (libro, cap, ver) => {
    setCargando(true);
    const capituloData = BIBLIA[libro]?.[cap];
    if (!capituloData) { Alert.alert('Error', 'Capítulo no encontrado'); setCargando(false); return; }
    let textos = [];
    if (ver) {
      const texto = capituloData[parseInt(ver) - 1];
      if (texto) { textos = [reemplazarNombres(texto)]; setReferenciaMostrada(`${libro} ${cap}:${ver}`); }
      else { Alert.alert('Error', 'Versículo no encontrado'); setCargando(false); return; }
    } else { textos = capituloData.map(v => reemplazarNombres(v)); setReferenciaMostrada(`${libro} ${cap}`); }
    setTextoMostrado(textos); setCargando(false);
  };

  const buscar = () => {
    if (!terminoBusqueda.trim()) { Alert.alert('Error', 'Escribe una palabra para buscar'); return; }
    const resultados = [];
    for (const [libro, capitulos] of Object.entries(BIBLIA)) {
      for (const [cap, versiculos] of Object.entries(capitulos)) {
        versiculos.forEach((texto, index) => {
          if (texto.toLowerCase().includes(terminoBusqueda.toLowerCase())) {
            resultados.push({ libro, capitulo: parseInt(cap), versiculo: index + 1, texto: reemplazarNombres(texto) });
          }
        });
      }
    }
    if (resultados.length === 0) { Alert.alert('Sin resultados', 'No se encontraron versículos'); }
    setResultadosBusqueda(resultados); setModoBusqueda(true);
  };

  const cargarCapituloCompleto = () => {
    if (!libroSeleccionado || !capitulo) { Alert.alert('Error', 'Selecciona un libro y capítulo'); return; }
    cargarVersiculo(libroSeleccionado, capitulo, null); setModalVisible(false);
  };

  const cargarVersiculoEspecifico = () => {
    if (!libroSeleccionado || !capitulo || !versiculo) { Alert.alert('Error', 'Selecciona libro, capítulo y versículo'); return; }
    cargarVersiculo(libroSeleccionado, capitulo, versiculo); setModalVisible(false);
  };

  const limpiarBusqueda = () => { setModoBusqueda(false); setResultadosBusqueda([]); setTerminoBusqueda(''); };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📖 La Biblia de Yahweh</Text>
          <Text style={styles.headerSub}>para que todo aquel que en Él cree, no se pierda, mas tenga vida eterna</Text>
        </View>
        <View style={styles.controlesContainer}>
          <TouchableOpacity style={styles.botonLibro} onPress={() => setModalVisible(true)}>
            <Text style={styles.botonLibroTexto}>📚 {libroSeleccionado} {capitulo}:{versiculo}</Text>
          </TouchableOpacity>
          <View style={styles.botonesAccion}>
            <TouchableOpacity style={[styles.botonAccion, styles.botonAccionAzul]} onPress={cargarCapituloCompleto}>
              <Text style={styles.botonAccionTexto}>📖 Capítulo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.botonAccion, styles.botonAccionVerde]} onPress={cargarVersiculoEspecifico}>
              <Text style={styles.botonAccionTexto}>📌 Versículo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.busquedaRow}>
            <TextInput style={styles.busquedaInput} value={terminoBusqueda} onChangeText={setTerminoBusqueda} placeholder="🔍 Buscar palabra..." placeholderTextColor="#666" onSubmitEditing={buscar} />
            <TouchableOpacity style={styles.botonBuscar} onPress={buscar}><Text style={styles.botonBuscarTexto}>Buscar</Text></TouchableOpacity>
          </View>
          {modoBusqueda && (<TouchableOpacity onPress={limpiarBusqueda}><Text style={styles.limpiarBusqueda}>✕ Limpiar búsqueda</Text></TouchableOpacity>)}
        </View>
        <View style={styles.resultadoContainer}>
          {cargando ? (
            <View style={styles.cargandoContainer}><ActivityIndicator size="large" color="#d4af37" /><Text style={styles.cargandoTexto}>Cargando...</Text></View>
          ) : modoBusqueda ? (
            <>
              <Text style={styles.resultadoTitulo}>🔍 Resultados: {resultadosBusqueda.length}</Text>
              {resultadosBusqueda.length > 0 ? resultadosBusqueda.map((r, i) => (
                <View key={i} style={styles.resultadoItem}><Text style={styles.resultadoRef}>{r.libro} {r.capitulo}:{r.versiculo}</Text><Text style={styles.resultadoTexto}>{r.texto}</Text></View>
              )) : (<Text style={styles.sinResultados}>No se encontraron versículos</Text>)}
            </>
          ) : textoMostrado.length > 0 ? (
            <><Text style={styles.referencia}>📖 {referenciaMostrada}</Text>{textoMostrado.map((texto, i) => (<Text key={i} style={styles.texto}>{textoMostrado.length > 1 ? `${i + 1}. ` : ''}{texto}</Text>))}<Text style={styles.nota}>🕎 Nombres en hebreo original</Text></>
          ) : null}
        </View>
        <View style={styles.footer}><Text style={styles.footerTexto}>📖 Reina-Valera 1960</Text><Text style={styles.footerSub}>Nombres restaurados al hebreo</Text></View>
      </ScrollView>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitulo}>📚 Seleccionar</Text>
            <ScrollView style={styles.modalLista} showsVerticalScrollIndicator={false}>
              {LIBROS.map((libro) => (<TouchableOpacity key={libro} style={[styles.modalItem, libroSeleccionado === libro && styles.modalItemSeleccionado]} onPress={() => setLibroSeleccionado(libro)}><Text style={[styles.modalItemTexto, libroSeleccionado === libro && styles.modalItemTextoSeleccionado]}>{libro}</Text></TouchableOpacity>))}
            </ScrollView>
            <View style={styles.modalInputs}>
              <View style={styles.modalInputGroup}><Text style={styles.modalLabel}>Capítulo:</Text><TextInput style={styles.modalInput} value={capitulo} onChangeText={setCapitulo} keyboardType="number-pad" placeholder="1" placeholderTextColor="#666" /></View>
              <View style={styles.modalInputGroup}><Text style={styles.modalLabel}>Versículo:</Text><TextInput style={styles.modalInput} value={versiculo} onChangeText={setVersiculo} keyboardType="number-pad" placeholder="1" placeholderTextColor="#666" /></View>
            </View>
            <TouchableOpacity style={styles.modalBoton} onPress={cargarVersiculoEspecifico}><Text style={styles.modalBotonTexto}>📖 Leer Versículo</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.modalBoton, styles.modalBotonSecundario]} onPress={cargarCapituloCompleto}><Text style={styles.modalBotonTexto}>📖 Leer Capítulo</Text></TouchableOpacity>
            <TouchableOpacity style={styles.modalCerrar} onPress={() => setModalVisible(false)}><Text style={styles.modalCerrarTexto}>Cerrar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a1a' },
  container: { flex: 1, padding: 16 },
  header: { backgroundColor: '#1a1a2e', padding: 20, borderRadius: 16, marginBottom: 16, alignItems: 'center', borderWidth: 1, borderColor: '#d4af37' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  headerSub: { fontSize: 12, color: '#d4af37', marginTop: 8, textAlign: 'center', fontStyle: 'italic', lineHeight: 18 },
  controlesContainer: { backgroundColor: '#1a1a2e', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2a2a4e' },
  botonLibro: { backgroundColor: '#2a2a4e', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  botonLibroTexto: { color: 'white', fontSize: 16, fontWeight: '600' },
  botonesAccion: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  botonAccion: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center' },
  botonAccionAzul: { backgroundColor: '#2a4a6e' },
  botonAccionVerde: { backgroundColor: '#2a5a3e' },
  botonAccionTexto: { color: 'white', fontWeight: '600' },
  busquedaRow: { flexDirection: 'row', gap: 10 },
  busquedaInput: { flex: 1, backgroundColor: '#0a0a1a', borderWidth: 1, borderColor: '#2a2a4e', borderRadius: 12, padding: 12, color: 'white', fontSize: 14 },
  botonBuscar: { backgroundColor: '#d4af37', padding: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  botonBuscarTexto: { color: '#1a1a2e', fontWeight: 'bold' },
  limpiarBusqueda: { color: '#d4af37', fontSize: 12, textAlign: 'right', marginTop: 8 },
  resultadoContainer: { backgroundColor: '#1a1a2e', padding: 20, borderRadius: 16, minHeight: 200, borderWidth: 1, borderColor: '#2a2a4e' },
  referencia: { color: '#d4af37', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  texto: { fontSize: 17, lineHeight: 28, color: 'white', marginBottom: 8 },
  nota: { color: '#666', fontSize: 12, textAlign: 'center', borderTopWidth: 1, borderTopColor: '#2a2a4e', paddingTop: 12, marginTop: 8 },
  cargandoContainer: { alignItems: 'center', justifyContent: 'center', padding: 30 },
  cargandoTexto: { color: '#d4af37', marginTop: 12 },
  resultadoTitulo: { color: '#d4af37', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  resultadoItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#2a2a4e' },
  resultadoRef: { color: '#d4af37', fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  resultadoTexto: { color: 'white', fontSize: 15, lineHeight: 24 },
  sinResultados: { color: '#666', textAlign: 'center', padding: 20 },
  footer: { marginTop: 16, alignItems: 'center', padding: 12 },
  footerTexto: { color: '#444', fontSize: 12 },
  footerSub: { color: '#333', fontSize: 10, marginTop: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#1a1a2e', borderRadius: 20, padding: 20, width: '92%', maxHeight: '85%', borderWidth: 1, borderColor: '#d4af37' },
  modalTitulo: { color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  modalLista: { maxHeight: 300 },
  modalItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#2a2a4e' },
  modalItemSeleccionado: { backgroundColor: '#2a2a4e', borderRadius: 8 },
  modalItemTexto: { color: '#aaa', fontSize: 15 },
  modalItemTextoSeleccionado: { color: '#d4af37', fontWeight: 'bold' },
  modalInputs: { flexDirection: 'row', gap: 12, marginTop: 16, marginBottom: 12 },
  modalInputGroup: { flex: 1 },
  modalLabel: { color: '#aaa', fontSize: 13, marginBottom: 4 },
  modalInput: { backgroundColor: '#0a0a1a', borderWidth: 1, borderColor: '#2a2a4e', borderRadius: 8, padding: 10, color: 'white', fontSize: 16 },
  modalBoton: { backgroundColor: '#d4af37', padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 8 },
  modalBotonSecundario: { backgroundColor: '#2a4a6e' },
  modalBotonTexto: { color: '#1a1a2e', fontSize: 16, fontWeight: 'bold' },
  modalCerrar: { marginTop: 8, padding: 10, alignItems: 'center' },
  modalCerrarTexto: { color: '#666', fontSize: 14 },
});
