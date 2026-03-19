<?php
/* ============================================
   Admin Login Page
   Handles authentication with session
   ============================================ */

session_start();

// If already logged in, redirect to dashboard
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header('Location: dashboard.php');
    exit;
}

$error = '';

// Process login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once 'db.php';

    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        $error = 'Please enter both username and password.';
    } else {
        // Look up the admin user
        $stmt = $conn->prepare("SELECT id, username, password FROM admin_users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $admin = $result->fetch_assoc();

            // Verify password hash
            if (password_verify($password, $admin['password'])) {
                // Set session variables
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_id'] = $admin['id'];
                $_SESSION['admin_username'] = $admin['username'];

                // Regenerate session ID to prevent fixation
                session_regenerate_id(true);

                header('Location: dashboard.php');
                exit;
            } else {
                $error = 'Invalid username or password.';
            }
        } else {
            $error = 'Invalid username or password.';
        }

        $stmt->close();
        $conn->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login | EventHub</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- Background Orbs -->
  <div class="bg-orbs">
    <div class="orb"></div>
    <div class="orb"></div>
    <div class="orb"></div>
  </div>

  <div class="container">

    <!-- Navbar -->
    <nav class="navbar glass">
      <a href="index.html" class="logo">EventHub</a>
      <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="register.html">Register</a></li>
        <li><a href="login.php" class="active">Admin</a></li>
      </ul>
    </nav>

    <!-- Login Form -->
    <div class="login-container glass">
      <div class="avatar">&#128274;</div>
      <h2>Admin Login</h2>
      <p class="subtitle">Enter your credentials to access the dashboard</p>

      <?php if (!empty($error)): ?>
        <div class="alert alert-danger">&#9888; <?php echo htmlspecialchars($error); ?></div>
      <?php endif; ?>

      <form method="POST" action="login.php">
        <div class="form-group">
          <label>Username</label>
          <input type="text" name="username" class="form-control" placeholder="Enter username" required
                 value="<?php echo htmlspecialchars($username ?? ''); ?>">
        </div>

        <div class="form-group">
          <label>Password</label>
          <div style="position:relative;">
            <input type="password" name="password" class="form-control" placeholder="Enter password" required
                   style="padding-right:48px;">
            <span class="password-toggle" style="position:absolute;right:16px;top:50%;transform:translateY(-50%);cursor:pointer;font-size:1.2rem;">&#128065;</span>
          </div>
        </div>

        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:16px;">
          Login &#10148;
        </button>
      </form>

      <p style="text-align:center;margin-top:20px;font-size:0.85rem;color:var(--text-muted);">
        Default: admin / admin123
      </p>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2026 EventHub | College Event Management System</p>
    </footer>

  </div>

  <script src="script.js"></script>
</body>
</html>
