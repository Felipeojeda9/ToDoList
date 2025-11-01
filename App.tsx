import React, { useState } from "react";
import { ImageBackground } from "react-native";
import { Linking } from "react-native";
import { SafeAreaView, View, Text, TextInput, FlatList, Pressable, StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from "react-native";

const generateId = () => Math.random().toString(36).slice(2, 9);
type Todo = { id: string; title: string; description: string; done: boolean };
type User = { username: string; password: string; name: string };

const USERS: User[] = [
  { username: "admin", password: "1234", name: "Administrador" },
  { username: "felipe", password: "ciisa", name: "Felipe" },
]
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [loginError, setLoginError] = useState("");

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const handleLogin = () => {
    const found = USERS.find(
      (x) => x.username === u.trim() && x.password === p
    );
    if (!found) return setLoginError("Usuario o contraseña inválidos.");
    setUser(found);
    setU("");
    setP("");
    setLoginError("");
  };
  const handleLogout = () => setUser(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
  };
    const handleSubmit = () => {
    const t = title.trim();
    if (!t) return;
    if (editingId) {
      setTodos((prev) =>
        prev.map((x) =>
          x.id === editingId ? { ...x, title: t, description } : x
        )
      );
      return resetForm();
    }
    setTodos((prev) => [
      { id: generateId(), title: t, description, done: false },
      ...prev,
    ]);
    resetForm();
  };
const handleToggleDone = (id: string) =>
    setTodos((prev) =>
      prev.map((x) => (x.id === id ? { ...x, done: !x.done } : x))
    );
 const handleDelete = (id: string) => {
    Alert.alert("Eliminar tarea", "¿Seguro que quieres eliminarla?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setTodos((prev) => prev.filter((x) => x.id !== id));
          if (editingId === id) resetForm();
        },
      },
    ]);
  };
  const handleEdit = (todo: Todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditingId(todo.id);
  };
  const renderItem = ({ item }: { item: Todo }) => { 
    const search = query.trim().toLowerCase();
    if (
      search &&
      !item.title.toLowerCase().includes(search) &&
      !item.description.toLowerCase().includes(search)
    ) {
      return null;
    }
    return (
      <View style={[styles.item, item.done && styles.itemDone]}>
        <Pressable onPress={() => handleToggleDone(item.id)} style={styles.dot}>
          <Text style={styles.dotText}>{item.done ? "✓" : ""}</Text>
        </Pressable>
        <View style={styles.itemText}>
          <Text
            style={[styles.itemTitle, item.done && styles.lineThrough]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {!!item.description && (
            <Text
              style={[styles.itemDesc, item.done && styles.lineThrough]}
              numberOfLines={2}
            >
              {item.description}
            </Text>
          )}
        </View>
        <View style={styles.itemActions}>
          <Pressable onPress={() => handleEdit(item)} style={styles.btnSmall}>
            <Text style={styles.btnSmallText}>Editar</Text>
          </Pressable>
          <Pressable
            onPress={() => handleDelete(item.id)}
            style={[styles.btnSmall, styles.danger]}
          >
            <Text style={styles.btnSmallText}>Eliminar</Text>
          </Pressable>
        </View>
      </View>
    );
  };
if (!user) {
  const loginBg = require("./assets/images/login-bg.png");
  return (
    <ImageBackground source={loginBg} style={{ flex: 1 }} resizeMode="cover">
      <SafeAreaView
        style={[styles.safe, { backgroundColor: "rgba(0,0,0,0.55)" }]}
      >
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: "padding" })}
        >
          <View style={[styles.container, { justifyContent: "center" }]}>
            <Text style={[styles.title, { textAlign: "center" }]}>
              Login — ToDoList
            </Text>

            <View
              style={[styles.card, { backgroundColor: "rgba(15,23,42,0.85)" }]}
            >
              <Text style={styles.cardTitle}>Ingresa tus credenciales</Text>
             <TextInput
                value={u}
                onChangeText={setU}
                placeholder="Usuario"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                style={styles.input}
                />
              <TextInput
                value={p}
                onChangeText={setP}
                placeholder="Contraseña"
                placeholderTextColor="#94a3b8"
                secureTextEntry
                style={styles.input}
                />
             {!!loginError && (
                <Text style={{ color: "#fca5a5" }}>{loginError}</Text>
              )}
              <Pressable
                onPress={handleLogin}
                style={[styles.btn, { marginTop: 8 }]}
                >
              <Text style={styles.btnText}>Entrar</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  Linking.openURL("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
                }
                style={[styles.btn, { backgroundColor: "#a70000ff", marginTop: 10 }]}
                >
                <Text style={styles.btnText}>NO PRESIONAR</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
}
return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: "padding" })}
      >
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.title}>Hola, {user.name} </Text>
            <Pressable
              onPress={handleLogout}
              style={[styles.btnSmall, styles.secondary]}
            >
              <Text style={styles.btnSmallText}>Salir</Text>
            </Pressable>
          </View>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar tareas…"
            placeholderTextColor="#94a3b8"
            style={styles.search}
          />

          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {editingId ? "Editar tarea" : "Nueva tarea"}
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Título (requerido)"
              placeholderTextColor="#94a3b8"
              style={styles.input}
            />
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Descripción (opcional)"
              placeholderTextColor="#94a3b8"
              style={[styles.input, styles.textarea]}
              multiline
              numberOfLines={3}
            />
            <View style={styles.row}>
              <Pressable onPress={handleSubmit} style={styles.btn}>
                <Text style={styles.btnText}>
                  {editingId ? "Guardar cambios" : "Agregar"}
                </Text>
              </Pressable>
              {editingId && (
                <Pressable
                  onPress={resetForm}
                  style={[styles.btn, styles.secondary]}
                >
                  <Text style={styles.btnText}>Cancelar</Text>
                </Pressable>
              )}
            </View>
          </View>

          {todos.length === 0 ? (
            <Text style={styles.muted}>No hay tareas.</Text>
          ) : (
            <FlatList
              data={todos}
              keyExtractor={(x) => x.id}
              renderItem={renderItem}
              contentContainerStyle={{ gap: 10, paddingBottom: 40 }}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0f172a" },
  container: { flex: 1, padding: 16, gap: 12 },
  title: { color: "#e2e8f0", fontSize: 20, fontWeight: "700" },
  search: {
    backgroundColor: "#0b1223",
    color: "#e2e8f0",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: "#0b1223",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  cardTitle: { color: "#e2e8f0", fontWeight: "600" },
  input: {
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textarea: { minHeight: 80, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 8 },
  btn: {
    backgroundColor: "#1e293b",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  secondary: { backgroundColor: "#0b1223", borderColor: "#334155" },
  btnText: { color: "#e2e8f0", fontWeight: "600" },
  muted: { color: "#94a3b8", marginTop: 8 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#0b1223",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  itemDone: { opacity: 0.7 },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
  },
  dotText: { color: "#e2e8f0", fontWeight: "800" },
  itemText: { flex: 1 },
  itemTitle: { color: "#e2e8f0", fontWeight: "700" },
  itemDesc: { color: "#94a3b8", marginTop: 2 },
  lineThrough: { textDecorationLine: "line-through", color: "#64748b" },
  itemActions: { flexDirection: "row", gap: 8 },
  btnSmall: {
    backgroundColor: "#1e293b",
    borderColor: "#334155",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  btnSmallText: { color: "#e2e8f0", fontWeight: "600" },
  danger: { backgroundColor: "#7f1d1d", borderColor: "#7f1d1d" },
});
