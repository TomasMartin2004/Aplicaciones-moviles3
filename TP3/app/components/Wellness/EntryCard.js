import React, { useState } from 'react';
import { Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EntryCard({ id, mood, note, date, image, onEdit, onDelete }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedNote, setEditedNote] = useState(note);

  const handleSave = () => {
    onEdit && onEdit(id, editedNote);
    setEditMode(false);
    setModalVisible(false);
  };

  const handleDelete = () => {
    Alert.alert('Eliminar entrada', '¿Estás seguro de que deseas eliminar esta entrada?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => onDelete && onDelete(id) },
    ]);
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setModalVisible(true)}>
        <View style={styles.header}>
          <Text style={styles.mood}>{mood}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <Text style={styles.note} numberOfLines={2} ellipsizeMode="tail">{note}</Text>
        {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalMood}>{mood}</Text>
            <Text style={styles.modalDate}>{date}</Text>
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
            {image ? <Image source={{ uri: image }} style={styles.modalImage} /> : null}
            <View style={styles.modalActions}>
              {editMode ? (
                <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Guardar</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.editBtn} onPress={() => setEditMode(true)}>
                  <Text style={styles.editBtnText}>Editar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteBtnText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeBtn} onPress={() => { setModalVisible(false); setEditMode(false); }}>
                <Text style={styles.closeBtnText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ECEFF4',
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
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
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(44, 62, 80, 0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 22,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
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
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    gap: 6,
  },
  editBtn: {
    backgroundColor: '#81A1C1',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 0,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: '#5E81AC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 0,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  deleteBtn: {
    backgroundColor: '#BF616A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 0,
  },
  deleteBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  closeBtn: {
    backgroundColor: '#E5E9F0',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
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
    width: 220,
    minHeight: 80,
    marginBottom: 10,
    textAlignVertical: 'top',
    fontWeight: '400',
    letterSpacing: 0.1,
  },
});
