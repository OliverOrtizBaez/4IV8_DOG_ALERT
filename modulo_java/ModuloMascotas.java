package modulomascotas;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;

public class ModuloMascotas extends JFrame {

    private static final String URL = "jdbc:mysql://localhost:3306/alerta_canina";
    private static final String USUARIO = "root";
    private static final String CONTRASENA = "4S43l2009"; 

    private JTextField txtNombre, txtPeso, txtRuac;
    private JComboBox<String> cbRaza, cbTamano, cbCollar;
    private JButton btnRegistrar;
    private JTable tablaMascotas;
    private DefaultTableModel modeloTabla;

    public ModuloMascotas() {
        setTitle("DogAlert - Módulo de Mascotas");
        setSize(600, 500);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setLayout(new BorderLayout());

        JPanel panelFormulario = new JPanel(new GridLayout(7, 2, 10, 10));
        panelFormulario.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        panelFormulario.add(new JLabel("Nombre del Perro:"));
        txtNombre = new JTextField();
        panelFormulario.add(txtNombre);

        panelFormulario.add(new JLabel("Raza:"));
        String[] razas = {"1. Mestizo", "2. Husky", "3. Pug", "4. Chihuahua", "5. Pitbull", "6. Golden"};
        cbRaza = new JComboBox<>(razas);
        panelFormulario.add(cbRaza);

        panelFormulario.add(new JLabel("Tamaño:"));
        String[] tamanos = {"1. Miniatura", "2. Chico", "3. Mediano", "4. Grande", "5. Gigante"};
        cbTamano = new JComboBox<>(tamanos);
        panelFormulario.add(cbTamano);

        panelFormulario.add(new JLabel("Peso (kg):"));
        txtPeso = new JTextField();
        panelFormulario.add(txtPeso);

        panelFormulario.add(new JLabel("¿Tiene Collar?:"));
        String[] opcionesCollar = {"Sí", "No"};
        cbCollar = new JComboBox<>(opcionesCollar);
        panelFormulario.add(cbCollar);

        panelFormulario.add(new JLabel("Código RUAC (Opcional):"));
        txtRuac = new JTextField();
        panelFormulario.add(txtRuac);

        btnRegistrar = new JButton("Registrar Mascota");
        panelFormulario.add(new JLabel(""));
        panelFormulario.add(btnRegistrar);

        add(panelFormulario, BorderLayout.NORTH);

        modeloTabla = new DefaultTableModel(new String[]{"ID", "Nombre", "Raza", "Peso (kg)"}, 0);
        tablaMascotas = new JTable(modeloTabla);
        JScrollPane scrollTabla = new JScrollPane(tablaMascotas);
        scrollTabla.setBorder(BorderFactory.createTitledBorder("Perros Registrados en DogAlert"));
        add(scrollTabla, BorderLayout.CENTER);

        btnRegistrar.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                registrarMascota();
            }
        });

        mostrarMascotas();
    }

    private void registrarMascota() {
        String nombre = txtNombre.getText().trim();
        String pesoTexto = txtPeso.getText().trim();
        
        if (nombre.isEmpty() || pesoTexto.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Por favor, llena los campos obligatorios (Nombre y Peso).", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        int idUsuario = 1; 
        int idRaza = cbRaza.getSelectedIndex() + 1;
        int idTamano = cbTamano.getSelectedIndex() + 1;
        double peso = Double.parseDouble(pesoTexto);
        int tieneCollar = cbCollar.getSelectedIndex() == 0 ? 1 : 0;
        String ruac = txtRuac.getText().trim().isEmpty() ? null : txtRuac.getText().trim();

        String sql = "INSERT INTO mascota (id_usuario, nombre, id_raza, id_tamano, peso, tiene_collar, ruac) VALUES (?, ?, ?, ?, ?, ?, ?)";

        try {
            // Esta línea le avisa a Java que use el conector que tienes en Libraries
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            try (Connection conexion = DriverManager.getConnection(URL, USUARIO, CONTRASENA);
                 PreparedStatement consulta = conexion.prepareStatement(sql)) {

                consulta.setInt(1, idUsuario);
                consulta.setString(2, nombre);
                consulta.setInt(3, idRaza);
                consulta.setInt(4, idTamano);
                consulta.setDouble(5, peso);
                consulta.setInt(6, tieneCollar);
                consulta.setString(7, ruac);

                int filasInsertadas = consulta.executeUpdate();
                if (filasInsertadas > 0) {
                    JOptionPane.showMessageDialog(this, "¡Perro registrado correctamente!", "Éxito", JOptionPane.INFORMATION_MESSAGE);
                    limpiarFormulario();
                    mostrarMascotas();
                }
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error al guardar en la base de datos.", "Error", JOptionPane.ERROR_MESSAGE);
            e.printStackTrace();
        }
    }

    private void mostrarMascotas() {
        modeloTabla.setRowCount(0);
        String sql = "SELECT m.id_mascota, m.nombre, r.nombre AS raza, m.peso " +
                     "FROM mascota m " +
                     "LEFT JOIN catalogo_raza r ON m.id_raza = r.id_raza";

        try {
            // También forzamos el driver aquí al cargar la tabla
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            try (Connection conexion = DriverManager.getConnection(URL, USUARIO, CONTRASENA);
                 Statement sentencia = conexion.createStatement();
                 ResultSet resultados = sentencia.executeQuery(sql)) {

                while (resultados.next()) {
                    int id = resultados.getInt("id_mascota");
                    String nombre = resultados.getString("nombre");
                    String raza = resultados.getString("raza");
                    double peso = resultados.getDouble("peso");

                    modeloTabla.addRow(new Object[]{id, nombre, raza, peso});
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private void limpiarFormulario() {
        txtNombre.setText("");
        txtPeso.setText("");
        txtRuac.setText("");
        cbRaza.setSelectedIndex(0);
        cbTamano.setSelectedIndex(0);
        cbCollar.setSelectedIndex(0);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                new ModuloMascotas().setVisible(true);
            }
        });
    }
}
