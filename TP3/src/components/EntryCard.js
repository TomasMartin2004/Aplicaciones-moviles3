import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Image, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const formatDate = (isoString) => {
  if (!isoString) return 'Fecha desconocida';
  try {
    const dateObj = new Date(isoString);
    if (isNaN(dateObj.getTime())) {
      return 'Fecha inválida';
    }
    return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch (e) {
    return 'Error en fecha';
  }
};

export default function EntryCard({ id, mood, note, createdAt, image, onEdit, onDelete }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState(note);

  const handleOpenModal = () => {
    setEditedNote(note);
    setEditMode(false);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditMode(false);
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(id, editedNote);
    }
    setEditMode(false);
    setModalVisible(false);
  };

  const handleDeletePress = () => {
    if (onDelete) {
      onDelete(id);
    }
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={handleOpenModal}>
        <View style={styles.header}>
          <Text style={styles.mood}>{mood}</Text>
          <Text style={styles.date}>{formatDate(createdAt)}</Text>
        </View>
        <Text style={styles.note} numberOfLines={2} ellipsizeMode="tail">{note}</Text>
        {image && (
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
      
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOuterContainer}>
          <BlurView 
            intensity={Platform.OS === 'ios' ? 60 : 30} 
            tint="dark" 
            style={styles.bleedFill} 
          />
          <View style={[styles.bleedFill, styles.modalBackdropCustom]} />
          <View style={styles.modalContent}>
            <Text style={styles.modalMood}>{mood}</Text>
            <Text style={styles.modalDate}>{formatDate(createdAt)}</Text>
            {editMode ? (
              <TextInput
                style={styles.editInput}
                value={editedNote}
                onChangeText={setEditedNote}
                multiline
                autoFocus
              />
            ) : (
              <Text style={styles.modalNote}>{note}</Text>
            )}
            {image && (
              <Image
                source={{ uri: image }}
                style={styles.modalImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.modalActions}>
              {editMode ? (
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.btnText}>Guardar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
                  <Text style={styles.btnText}>Editar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDeletePress}>
                <Text style={styles.btnText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={handleCloseModal}>
              <Text style={styles.closeBtnText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  bleedFill: { 
    position: 'absolute',
    top: -2, 
    left: -2,
    bottom: -2,
    right: -2,
    width: '100.5%', 
    height: '100.5%',
  },
  card: {
    backgroundColor: '#ECEFF4',
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
      },
    }),
    borderWidth: 1,
    borderColor: '#E5E9F0',
    minHeight: 70,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  mood: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5E81AC',
  },
  date: {
    fontSize: 11,
    color: '#7B8794',
    fontWeight: '400',
  },
  note: {
    fontSize: 15,
    color: '#2E3440',
    marginBottom: 4,
    fontWeight: '400',
    letterSpacing: 0.1,
  },
  image: {
    width: '100%',
    height: 90,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: '#E5E9F0',
  },
  modalOuterContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackdropCustom: { 
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 22,
    width: '90%',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 4px 10px rgba(0,0,0,0.07)',
      },
    }),
    zIndex: 1, 
  },
  modalMood: {
    fontSize: 26,
    marginBottom: 2,
    color: '#5E81AC',
    fontWeight: '600',
  },
  modalDate: {
    fontSize: 12,
    color: '#7B8794',
    marginBottom: 10,
    fontWeight: '400',
  },
  modalNote: {
    fontSize: 16,
    color: '#2E3440',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '400',
    letterSpacing: 0.1,
    maxHeight: 150,
  },
  modalImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#E5E9F0',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 8,
    marginBottom: 12,
    gap: 10,
  },
  editBtn: {
    backgroundColor: '#81A1C1',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  saveBtn: {
    backgroundColor: '#5E81AC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  deleteBtn: {
    backgroundColor: '#BF616A',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  closeBtn: {
    backgroundColor: '#E5E9F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#2E3440',
    fontWeight: 'bold',
    fontSize: 15,
  },
  editInput: {
    backgroundColor: '#F3F6FA',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#2E3440',
    width: '100%',
    minHeight: 80,
    maxHeight: 150,
    marginBottom: 10,
    textAlignVertical: 'top',
    fontWeight: '400',
    letterSpacing: 0.1,
    borderWidth: 1,
    borderColor: '#D8DEE9'
  },
});