import javax.swing.*;
import javax.swing.border.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.geom.RoundRectangle2D;
import java.net.URI;
import java.net.URL;

/**
Integrantes del equipo:
Anteliz Martínez Asael
Delgado Lopez Claudio Ivan
Hernandez Villasana Guillermo Adrian
Mendoza Calvillo Diego
Olivares Barreto Alan Israel
Ortiz Báez Oliver
 */
public class AlertaCaninaPresentacion extends JFrame {

    private static final String RUTA_MAPA_NAV = "Mapa de Navegacion (1).pdf";

    private static final String URL_LOOK_AND_FEEL =
        "https://www.canva.com/design/DAHCZU-DE1I/kkjh9XY6jOOfHLotWD9JUg/edit" +
        "?classId=93ff7dc4-94ba-4e9a-bbfa-49616e145f90" +
        "&assignmentId=e77adc76-0dbf-4730-8ca1-e4746bfc92ca" +
        "&submissionId=d815188a-d611-e260-1f6b-77e69669bbe2";


    private static final String URL_SITIO_WEB =
        "https://github.com/OliverOrtizBaez/4IV8_DOG_ALERT.git";

    private static final Color IPN_GUINDA      = new Color(109,  0,  40);
    private static final Color IPN_GUINDA_DARK = new Color( 80,  0,  28);
    private static final Color IPN_GUINDA_SOFT = new Color(140, 20,  60);
    private static final Color IPN_GOLD        = new Color(212,175,  55);
    private static final Color BG_CREAM        = new Color(252,248, 244);
    private static final Color TEXT_DARK       = new Color( 30, 10,  10);
    private static final Color TEXT_MID        = new Color( 90, 40,  50);
    private static final Color CARD_BG         = new Color(255,255, 255);
    private static final Color BORDER_LIGHT    = new Color(220,200, 205);

    public AlertaCaninaPresentacion() {
        setTitle("DOG ALERT - Presentacion del Proyecto | IPN 4IV8");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(780, 700);
        setMinimumSize(new Dimension(680, 600));
        setLocationRelativeTo(null);
        setResizable(true);

        JPanel root = new JPanel(new BorderLayout());
        root.setBackground(BG_CREAM);
        setContentPane(root);

        root.add(crearHeader(), BorderLayout.NORTH);

        JPanel body = crearCuerpo();
        JScrollPane scroll = new JScrollPane(body);
        scroll.setBorder(null);
        scroll.getVerticalScrollBar().setUnitIncrement(12);
        scroll.setBackground(BG_CREAM);
        root.add(scroll, BorderLayout.CENTER);

        root.add(crearFooter(), BorderLayout.SOUTH);
    }

    // ==========================================================
    //  HEADER
    // ==========================================================
    private JPanel crearHeader() {
        JPanel header = new JPanel(new BorderLayout()) {
            @Override
            protected void paintComponent(Graphics g) {
                super.paintComponent(g);
                Graphics2D g2 = (Graphics2D) g;
                GradientPaint grad = new GradientPaint(
                    0, 0, IPN_GUINDA_DARK,
                    getWidth(), getHeight(), IPN_GUINDA_SOFT
                );
                g2.setPaint(grad);
                g2.fillRect(0, 0, getWidth(), getHeight());
            }
        };
        header.setPreferredSize(new Dimension(0, 110));
        header.setBorder(new EmptyBorder(18, 28, 18, 28));

        JPanel txtPanel = new JPanel();
        txtPanel.setLayout(new BoxLayout(txtPanel, BoxLayout.Y_AXIS));
        txtPanel.setOpaque(false);

        JLabel titulo = new JLabel("DOG ALERT");
        titulo.setFont(new Font("Segoe UI", Font.BOLD, 30));
        titulo.setForeground(IPN_GOLD);

        JLabel subtitulo = new JLabel("Sistema de Boletines Digitales para Mascotas Perdidas");
        subtitulo.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitulo.setForeground(new Color(255, 230, 220));

        JLabel creditos = new JLabel("Instituto Politecnico Nacional  |  Laboratorio 4IV8");
        creditos.setFont(new Font("Segoe UI", Font.ITALIC, 11));
        creditos.setForeground(new Color(210, 180, 185));

        txtPanel.add(titulo);
        txtPanel.add(Box.createVerticalStrut(4));
        txtPanel.add(subtitulo);
        txtPanel.add(Box.createVerticalStrut(4));
        txtPanel.add(creditos);

        JPanel lineaDorada = new JPanel();
        lineaDorada.setBackground(IPN_GOLD);
        lineaDorada.setPreferredSize(new Dimension(0, 3));

        header.add(txtPanel, BorderLayout.CENTER);
        header.add(lineaDorada, BorderLayout.SOUTH);
        return header;
    }

    // ==========================================================
    //  CUERPO
    // ==========================================================
    private JPanel crearCuerpo() {
        JPanel body = new JPanel();
        body.setLayout(new BoxLayout(body, BoxLayout.Y_AXIS));
        body.setBackground(BG_CREAM);
        body.setBorder(new EmptyBorder(24, 32, 24, 32));

        body.add(crearSeccionTitulo("Generalidades del Proyecto"));
        body.add(Box.createVerticalStrut(10));
        body.add(crearTarjetaGeneralidades());
        body.add(Box.createVerticalStrut(24));

        body.add(crearSeccionTitulo("Stack Tecnologico"));
        body.add(Box.createVerticalStrut(10));
        body.add(crearTarjetaTecnologias());
        body.add(Box.createVerticalStrut(24));

        body.add(crearSeccionTitulo("Recursos del Proyecto"));
        body.add(Box.createVerticalStrut(12));
        body.add(crearPanelBotones());
        body.add(Box.createVerticalStrut(16));

        return body;
    }

    // ==========================================================
    //  TARJETA GENERALIDADES
    // ==========================================================
    private JPanel crearTarjetaGeneralidades() {
        JPanel card = crearTarjeta();
        card.setLayout(new BoxLayout(card, BoxLayout.Y_AXIS));

        String[][] items = {
            { "Objetivo",
              "Desarrollar una plataforma web para la gestion y difusion de reportes de mascotas\n" +
              "perdidas en la Ciudad de Mexico, permitiendo a duenos crear boletines digitales\n" +
              "con foto, ubicacion en mapa y datos de contacto para su rapida localizacion." },
            { "Problema que Resuelve",
              "La perdida de mascotas carece de un canal digital unificado. DOG ALERT centraliza\n" +
              "los reportes, facilita la busqueda por colonia y alcaldia, y conecta a duenos\n" +
              "con rescatistas y albergues de la CDMX." },
            { "Usuarios Objetivo",
              "- Duenos de mascotas que reportan perdidas o extravios.\n" +
              "- Rescatistas y albergues que localizan y resguardan animales.\n" +
              "- Administradores que validan reportes y gestionan el sistema." },
            { "Funcionalidades Clave",
              "- Registro de mascotas con RUAC, foto en Base64 y caracteristicas fisicas.\n" +
              "- Creacion de reportes con mapa interactivo (Leaflet + OpenStreetMap).\n" +
              "- Panel de busqueda con filtros por raza, alcaldia, estatus y recompensa.\n" +
              "- Autenticacion segura con bcrypt y validacion contra inyecciones SQL." },
        };

        for (int i = 0; i < items.length; i++) {
            if (i > 0) {
                JSeparator sep = new JSeparator();
                sep.setForeground(BORDER_LIGHT);
                sep.setMaximumSize(new Dimension(Integer.MAX_VALUE, 1));
                card.add(sep);
                card.add(Box.createVerticalStrut(12));
            }
            card.add(crearItemGeneralidad(items[i][0], items[i][1]));
            card.add(Box.createVerticalStrut(12));
        }
        return card;
    }

    private JPanel crearItemGeneralidad(String titulo, String texto) {
        JPanel p = new JPanel(new BorderLayout(12, 4));
        p.setOpaque(false);

        JLabel lblTitulo = new JLabel(titulo);
        lblTitulo.setFont(new Font("Segoe UI", Font.BOLD, 13));
        lblTitulo.setForeground(IPN_GUINDA);

        JTextArea ta = new JTextArea(texto);
        ta.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        ta.setForeground(TEXT_DARK);
        ta.setOpaque(false);
        ta.setEditable(false);
        ta.setFocusable(false);
        ta.setLineWrap(true);
        ta.setWrapStyleWord(true);
        ta.setBorder(null);

        p.add(lblTitulo, BorderLayout.NORTH);
        p.add(ta, BorderLayout.CENTER);
        return p;
    }

    // ==========================================================
    //  TARJETA TECNOLOGIAS
    // ==========================================================
    private JPanel crearTarjetaTecnologias() {
        JPanel card = crearTarjeta();
        card.setLayout(new GridLayout(2, 3, 16, 12));

        String[][] techs = {
            { "Backend",       "Node.js + Express" },
            { "Base de Datos", "MySQL 8 + mysql2" },
            { "Seguridad",     "bcrypt + express-validator" },
            { "Mapas",         "Leaflet + OpenStreetMap" },
            { "Frontend",      "HTML5 + CSS3 + Vanilla JS" },
            { "Despliegue",    "Servidor local / GitHub" },
        };

        for (String[] tech : techs) {
            JPanel chip = new JPanel(new BorderLayout(4, 2));
            chip.setBackground(new Color(250, 240, 242));
            chip.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(210, 180, 190), 1, true),
                new EmptyBorder(8, 10, 8, 10)
            ));

            JLabel ico = new JLabel(tech[0]);
            ico.setFont(new Font("Segoe UI", Font.BOLD, 12));
            ico.setForeground(IPN_GUINDA);

            JLabel val = new JLabel(tech[1]);
            val.setFont(new Font("Segoe UI", Font.PLAIN, 11));
            val.setForeground(TEXT_MID);

            chip.add(ico, BorderLayout.NORTH);
            chip.add(val, BorderLayout.CENTER);
            card.add(chip);
        }
        return card;
    }

    // ==========================================================
    //  PANEL DE BOTONES
    // ==========================================================
    private JPanel crearPanelBotones() {
        JPanel panel = new JPanel(new GridLayout(1, 3, 16, 0));
        panel.setOpaque(false);
        panel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 90));

        // Boton 1: Mapa de navegacion (abre PDF)
        JButton btnMapa = crearBotonAccion(
            "Mapa de Navegacion",
            "Ver flujo de pantallas",
            IPN_GUINDA
        );
        btnMapa.addActionListener(e -> abrirPDF(
            RUTA_MAPA_NAV   // <- nombre del PDF en esta misma carpeta
        ));

        // Boton 2: Look and Feel (abre link de Canva)
        JButton btnLook = crearBotonAccion(
            "Look & Feel",
            "Ver diseno visual en Canva",
            new Color(140, 60, 20)
        );
        btnLook.addActionListener(e -> abrirEnNavegador(
            URL_LOOK_AND_FEEL   // <- link de Canva definido arriba
        ));

        // Boton 3: Sitio web / GitHub
        JButton btnWeb = crearBotonAccion(
            "Abrir Repositorio",
            "Ver codigo en GitHub",
            new Color(20, 80, 140)
        );
        btnWeb.addActionListener(e -> abrirEnNavegador(
            URL_SITIO_WEB   // <- link de GitHub definido arriba
        ));

        panel.add(btnMapa);
        panel.add(btnLook);
        panel.add(btnWeb);
        return panel;
    }

    // ==========================================================
    //  FOOTER
    // ==========================================================
    private JPanel crearFooter() {
        JPanel footer = new JPanel(new FlowLayout(FlowLayout.CENTER, 0, 8));
        footer.setBackground(IPN_GUINDA_DARK);

        JLabel lbl = new JLabel("Instituto Politecnico Nacional  |  Grupo 4IV8  |  DOG ALERT  |  2026");
        lbl.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        lbl.setForeground(new Color(200, 170, 175));
        footer.add(lbl);
        return footer;
    }

    // ==========================================================
    //  COMPONENTES AUXILIARES
    // ==========================================================
    private JPanel crearTarjeta() {
        JPanel card = new JPanel();
        card.setBackground(CARD_BG);
        card.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(BORDER_LIGHT, 1, true),
            new EmptyBorder(18, 20, 18, 20)
        ));
        card.setAlignmentX(Component.LEFT_ALIGNMENT);
        card.setMaximumSize(new Dimension(Integer.MAX_VALUE, Integer.MAX_VALUE));
        return card;
    }

    private JLabel crearSeccionTitulo(String texto) {
        JLabel lbl = new JLabel(texto);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 14));
        lbl.setForeground(IPN_GUINDA);
        lbl.setAlignmentX(Component.LEFT_ALIGNMENT);
        lbl.setBorder(new EmptyBorder(0, 2, 0, 0));
        return lbl;
    }

    private JButton crearBotonAccion(String titulo, String subtitulo, Color color) {
        JButton btn = new JButton() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2 = (Graphics2D) g.create();
                g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                if (getModel().isPressed()) {
                    g2.setColor(color.darker());
                } else if (getModel().isRollover()) {
                    g2.setColor(color.brighter());
                } else {
                    g2.setColor(color);
                }
                g2.fill(new RoundRectangle2D.Float(0, 0, getWidth(), getHeight(), 12, 12));
                g2.dispose();
                super.paintComponent(g);
            }
        };

        btn.setLayout(new BoxLayout(btn, BoxLayout.Y_AXIS));
        btn.setOpaque(false);
        btn.setContentAreaFilled(false);
        btn.setBorderPainted(false);
        btn.setFocusPainted(false);
        btn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        btn.setBorder(new EmptyBorder(14, 10, 14, 10));

        JLabel lblTitulo = new JLabel(titulo);
        lblTitulo.setFont(new Font("Segoe UI", Font.BOLD, 13));
        lblTitulo.setForeground(Color.WHITE);
        lblTitulo.setAlignmentX(Component.CENTER_ALIGNMENT);

        JLabel lblSub = new JLabel("<html><center>" + subtitulo + "</center></html>");
        lblSub.setFont(new Font("Segoe UI", Font.PLAIN, 10));
        lblSub.setForeground(new Color(255, 255, 255, 180));
        lblSub.setAlignmentX(Component.CENTER_ALIGNMENT);

        btn.add(Box.createVerticalGlue());
        btn.add(lblTitulo);
        btn.add(Box.createVerticalStrut(4));
        btn.add(lblSub);
        btn.add(Box.createVerticalGlue());

        return btn;
    }

    // ==========================================================
    //  ACCIONES
    // ==========================================================

    /**
     * Abre un PDF con el visor predeterminado del sistema (Adobe, Edge, etc.)
     * El archivo debe estar en la misma carpeta que el .java/.class
     */
    private void abrirPDF(String ruta) {
        try {
            java.io.File archivo = new java.io.File(ruta);
            if (!archivo.exists()) {
                JOptionPane.showMessageDialog(this,
                    "No se encontro el archivo PDF:\n\"" + ruta + "\"\n\n" +
                    "Asegurate de que el archivo este en la misma carpeta\n" +
                    "que AlertaCaninaPresentacion.java con ese nombre exacto.",
                    "Archivo no encontrado",
                    JOptionPane.WARNING_MESSAGE
                );
                return;
            }
            if (!Desktop.isDesktopSupported() ||
                !Desktop.getDesktop().isSupported(Desktop.Action.OPEN)) {
                JOptionPane.showMessageDialog(this,
                    "Tu sistema no permite abrir archivos automaticamente.\n" +
                    "Abre manualmente:\n" + archivo.getAbsolutePath(),
                    "Accion no soportada",
                    JOptionPane.INFORMATION_MESSAGE
                );
                return;
            }
            Desktop.getDesktop().open(archivo);
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this,
                "Error al abrir el PDF:\n" + ex.getMessage(),
                "Error",
                JOptionPane.ERROR_MESSAGE
            );
        }
    }

    /**
     * Abre una URL en el navegador predeterminado del sistema.
     */
    private void abrirEnNavegador(String url) {
        try {
            Desktop.getDesktop().browse(new URI(url));
        } catch (Exception ex) {
            JOptionPane.showMessageDialog(this,
                "No se pudo abrir el navegador.\nCopia esta URL manualmente:\n\n" + url,
                "Error al abrir navegador",
                JOptionPane.ERROR_MESSAGE
            );
        }
    }

    // ==========================================================
    //  MAIN
    // ==========================================================
    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {}

        SwingUtilities.invokeLater(() -> {
            AlertaCaninaPresentacion ventana = new AlertaCaninaPresentacion();
            ventana.setVisible(true);
        });
    }
}
