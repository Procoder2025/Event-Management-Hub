<?php
/* ============================================
   Registration Handler
   Processes form data, validates, and stores
   ============================================ */

// Include database connection
require_once 'db.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: register.html');
    exit;
}

// ---- Collect and Sanitize Input ----
$name       = trim(htmlspecialchars($_POST['name'] ?? '', ENT_QUOTES, 'UTF-8'));
$email      = trim(filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL));
$phone      = trim(htmlspecialchars($_POST['phone'] ?? '', ENT_QUOTES, 'UTF-8'));
$department = trim(htmlspecialchars($_POST['department'] ?? '', ENT_QUOTES, 'UTF-8'));
$year       = intval($_POST['year'] ?? 0);
$event      = trim(htmlspecialchars($_POST['event'] ?? '', ENT_QUOTES, 'UTF-8'));

// ---- Backend Validation ----
$errors = [];

if (strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email address.';
}

if (!preg_match('/^[0-9]{10}$/', $phone)) {
    $errors[] = 'Phone must be a 10-digit number.';
}

$valid_departments = ['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'IT', 'AIDS', 'MBA', 'OTHER'];
if (!in_array($department, $valid_departments)) {
    $errors[] = 'Invalid department selected.';
}

if ($year < 1 || $year > 4) {
    $errors[] = 'Invalid year selected.';
}

$valid_events = ['TechFest 2026', 'Cultural Night', 'Sports Meet', 'Workshop Series', 'Guest Lecture', 'Quiz Competition'];
if (!in_array($event, $valid_events)) {
    $errors[] = 'Invalid event selected.';
}

// ---- Check for Duplicate Email ----
$stmt = $conn->prepare("SELECT id FROM registrations WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
if ($stmt->get_result()->num_rows > 0) {
    $errors[] = 'This email is already registered.';
}
$stmt->close();

// ---- File Upload Handling ----
$id_proof_path = null;

if (isset($_FILES['id_proof']) && $_FILES['id_proof']['error'] === UPLOAD_ERR_OK) {
    $file = $_FILES['id_proof'];
    $max_size = 2 * 1024 * 1024; // 2MB
    $allowed_types = ['image/jpeg', 'image/png', 'application/pdf'];
    $allowed_exts = ['jpg', 'jpeg', 'png', 'pdf'];

    // Get file extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($file['type'], $allowed_types) || !in_array($ext, $allowed_exts)) {
        $errors[] = 'Only JPG, PNG, or PDF files are allowed.';
    } elseif ($file['size'] > $max_size) {
        $errors[] = 'File size must be less than 2MB.';
    } else {
        // Create uploads directory if it doesn't exist
        $upload_dir = 'uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0755, true);
        }

        // Generate unique filename to prevent overwrites
        $unique_name = uniqid('id_', true) . '.' . $ext;
        $id_proof_path = $upload_dir . $unique_name;

        if (!move_uploaded_file($file['tmp_name'], $id_proof_path)) {
            $errors[] = 'Failed to upload file. Please try again.';
            $id_proof_path = null;
        }
    }
}

// ---- If Errors, Redirect Back ----
if (!empty($errors)) {
    $error_msg = urlencode(implode(' ', $errors));
    header("Location: register.html?error=$error_msg");
    exit;
}

// ---- Insert into Database ----
$stmt = $conn->prepare(
    "INSERT INTO registrations (name, email, phone, department, year, event, id_proof)
     VALUES (?, ?, ?, ?, ?, ?, ?)"
);
$stmt->bind_param("ssssiss", $name, $email, $phone, $department, $year, $event, $id_proof_path);

if ($stmt->execute()) {
    $stmt->close();
    $conn->close();
    // Redirect to success page
    header("Location: success.html");
    exit;
} else {
    $stmt->close();
    $conn->close();
    header("Location: register.html?error=" . urlencode('Registration failed. Please try again.'));
    exit;
}
?>
