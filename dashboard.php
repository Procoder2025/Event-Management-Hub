<?php
/* ============================================
   Admin Dashboard
   View, search, filter, edit, delete records
   ============================================ */

session_start();

// ---- Auth Check: Redirect if not logged in ----
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: login.php');
    exit;
}

require_once 'db.php';

$message = '';
$msg_type = '';

// ---- Handle Delete ----
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {

    if ($_POST['action'] === 'delete' && isset($_POST['record_id'])) {
        $id = intval($_POST['record_id']);

        // Get file path before deleting (to remove uploaded file)
        $stmt = $conn->prepare("SELECT id_proof FROM registrations WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 1) {
            $row = $result->fetch_assoc();
            // Delete the uploaded file if it exists
            if ($row['id_proof'] && file_exists($row['id_proof'])) {
                unlink($row['id_proof']);
            }
        }
        $stmt->close();

        // Delete the record
        $stmt = $conn->prepare("DELETE FROM registrations WHERE id = ?");
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            $message = 'Record deleted successfully.';
            $msg_type = 'success';
        } else {
            $message = 'Failed to delete record.';
            $msg_type = 'danger';
        }
        $stmt->close();
    }

    // ---- Handle Edit/Update ----
    if ($_POST['action'] === 'edit' && isset($_POST['edit_id'])) {
        $id         = intval($_POST['edit_id']);
        $name       = trim(htmlspecialchars($_POST['edit_name'] ?? '', ENT_QUOTES, 'UTF-8'));
        $email      = trim(filter_var($_POST['edit_email'] ?? '', FILTER_SANITIZE_EMAIL));
        $phone      = trim(htmlspecialchars($_POST['edit_phone'] ?? '', ENT_QUOTES, 'UTF-8'));
        $department = trim(htmlspecialchars($_POST['edit_department'] ?? '', ENT_QUOTES, 'UTF-8'));
        $year       = intval($_POST['edit_year'] ?? 0);
        $event      = trim(htmlspecialchars($_POST['edit_event'] ?? '', ENT_QUOTES, 'UTF-8'));

        // Basic validation
        if (strlen($name) >= 2 && filter_var($email, FILTER_VALIDATE_EMAIL) && preg_match('/^[0-9]{10}$/', $phone)) {
            // Check email uniqueness (excluding current record)
            $stmt = $conn->prepare("SELECT id FROM registrations WHERE email = ? AND id != ?");
            $stmt->bind_param("si", $email, $id);
            $stmt->execute();

            if ($stmt->get_result()->num_rows > 0) {
                $message = 'Email already exists for another registration.';
                $msg_type = 'danger';
            } else {
                $stmt->close();
                $stmt = $conn->prepare(
                    "UPDATE registrations SET name=?, email=?, phone=?, department=?, year=?, event=? WHERE id=?"
                );
                $stmt->bind_param("ssssissi", $name, $email, $phone, $department, $year, $event, $id);

                // Fix: 7 params for 7 placeholders
                $stmt2 = $conn->prepare(
                    "UPDATE registrations SET name=?, email=?, phone=?, department=?, year=?, event=? WHERE id=?"
                );
                $stmt2->bind_param("ssssisi", $name, $email, $phone, $department, $year, $event, $id);

                if ($stmt2->execute()) {
                    $message = 'Record updated successfully.';
                    $msg_type = 'success';
                } else {
                    $message = 'Failed to update record.';
                    $msg_type = 'danger';
                }
                $stmt2->close();
            }
        } else {
            $message = 'Please check your input values.';
            $msg_type = 'danger';
        }
    }
}

// ---- Handle Logout ----
if (isset($_GET['logout'])) {
    session_destroy();
    header('Location: login.php');
    exit;
}

// ---- Fetch All Registrations ----
$registrations = [];
$result = $conn->query("SELECT * FROM registrations ORDER BY registered_at DESC");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $registrations[] = $row;
    }
}

// ---- Stats ----
$total = count($registrations);

// Count by department
$dept_counts = [];
foreach ($registrations as $r) {
    $dept_counts[$r['department']] = ($dept_counts[$r['department']] ?? 0) + 1;
}

// Count by event
$event_counts = [];
foreach ($registrations as $r) {
    $event_counts[$r['event']] = ($event_counts[$r['event']] ?? 0) + 1;
}

// Today's registrations
$today = date('Y-m-d');
$today_count = 0;
foreach ($registrations as $r) {
    if (substr($r['registered_at'], 0, 10) === $today) {
        $today_count++;
    }
}

$conn->close();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard | EventHub Admin</title>
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
      <a href="dashboard.php" class="logo">EventHub Admin</a>
      <button class="nav-toggle" aria-label="Toggle navigation">☰</button>
      <ul class="nav-links">
        <li><a href="index.html">View Site</a></li>
        <li><a href="dashboard.php" class="active">Dashboard</a></li>
        <li><a href="dashboard.php?logout=1" style="color:var(--danger);">Logout</a></li>
      </ul>
    </nav>

    <!-- Alert Messages -->
    <?php if (!empty($message)): ?>
      <div class="alert alert-<?php echo $msg_type; ?> fade-in">
        <?php echo $msg_type === 'success' ? '&#10003;' : '&#9888;'; ?>
        <?php echo htmlspecialchars($message); ?>
      </div>
    <?php endif; ?>

    <!-- Dashboard Header -->
    <div class="dashboard-header fade-in">
      <div>
        <h2>Dashboard</h2>
        <p style="color:var(--text-muted);font-size:0.9rem;">
          Welcome, <strong><?php echo htmlspecialchars($_SESSION['admin_username']); ?></strong>
        </p>
      </div>
      <div class="dashboard-actions">
        <button class="btn btn-primary btn-sm" onclick="exportToCSV()">&#128230; Export CSV</button>
        <a href="dashboard.php?logout=1" class="btn btn-danger btn-sm">&#9211; Logout</a>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid fade-in">
      <div class="stat-card glass">
        <div class="stat-number"><?php echo $total; ?></div>
        <div class="stat-label">Total Registrations</div>
      </div>
      <div class="stat-card glass">
        <div class="stat-number"><?php echo $today_count; ?></div>
        <div class="stat-label">Today's Registrations</div>
      </div>
      <div class="stat-card glass">
        <div class="stat-number"><?php echo count($dept_counts); ?></div>
        <div class="stat-label">Departments</div>
      </div>
      <div class="stat-card glass">
        <div class="stat-number"><?php echo count($event_counts); ?></div>
        <div class="stat-label">Active Events</div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar fade-in">
      <input type="text" id="searchInput" class="search-input" placeholder="&#128269; Search by name, email, phone...">
      <select id="deptFilter">
        <option value="">All Departments</option>
        <option value="CSE">CSE</option>
        <option value="ECE">ECE</option>
        <option value="EEE">EEE</option>
        <option value="MECH">MECH</option>
        <option value="CIVIL">CIVIL</option>
        <option value="IT">IT</option>
        <option value="AIDS">AIDS</option>
        <option value="MBA">MBA</option>
        <option value="OTHER">Other</option>
      </select>
      <select id="eventFilter">
        <option value="">All Events</option>
        <option value="TechFest 2026">TechFest 2026</option>
        <option value="Cultural Night">Cultural Night</option>
        <option value="Sports Meet">Sports Meet</option>
        <option value="Workshop Series">Workshop Series</option>
        <option value="Guest Lecture">Guest Lecture</option>
        <option value="Quiz Competition">Quiz Competition</option>
      </select>
    </div>

    <!-- Data Table -->
    <div class="table-wrapper glass fade-in">
      <?php if (empty($registrations)): ?>
        <div class="empty-state">
          <div class="icon">&#128203;</div>
          <p>No registrations yet. Share the registration link to get started!</p>
        </div>
      <?php else: ?>
        <table class="data-table" id="registrationTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Year</th>
              <th>Event</th>
              <th>ID Proof</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($registrations as $index => $reg): ?>
              <tr data-dept="<?php echo htmlspecialchars($reg['department']); ?>"
                  data-event="<?php echo htmlspecialchars($reg['event']); ?>">
                <td><?php echo $index + 1; ?></td>
                <td><strong><?php echo htmlspecialchars($reg['name']); ?></strong></td>
                <td><?php echo htmlspecialchars($reg['email']); ?></td>
                <td><?php echo htmlspecialchars($reg['phone']); ?></td>
                <td><span class="dept-badge"><?php echo htmlspecialchars($reg['department']); ?></span></td>
                <td><?php echo htmlspecialchars($reg['year']); ?></td>
                <td><?php echo htmlspecialchars($reg['event']); ?></td>
                <td>
                  <?php if ($reg['id_proof']): ?>
                    <a href="<?php echo htmlspecialchars($reg['id_proof']); ?>" target="_blank"
                       style="color:var(--primary);text-decoration:none;">View &#8599;</a>
                  <?php else: ?>
                    <span style="color:var(--text-muted);">—</span>
                  <?php endif; ?>
                </td>
                <td style="white-space:nowrap;"><?php echo date('M d, Y', strtotime($reg['registered_at'])); ?></td>
                <td>
                  <div class="actions">
                    <button class="btn btn-success btn-sm" onclick="openEditModal(
                      <?php echo $reg['id']; ?>,
                      '<?php echo addslashes(htmlspecialchars($reg['name'])); ?>',
                      '<?php echo addslashes(htmlspecialchars($reg['email'])); ?>',
                      '<?php echo addslashes(htmlspecialchars($reg['phone'])); ?>',
                      '<?php echo addslashes(htmlspecialchars($reg['department'])); ?>',
                      '<?php echo $reg['year']; ?>',
                      '<?php echo addslashes(htmlspecialchars($reg['event'])); ?>'
                    )">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteRecord(<?php echo $reg['id']; ?>)">Delete</button>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      <?php endif; ?>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>&copy; 2026 EventHub Admin | Logged in as <?php echo htmlspecialchars($_SESSION['admin_username']); ?></p>
    </footer>

  </div>

  <!-- Edit Modal -->
  <div class="modal-overlay" id="editModal">
    <div class="modal glass">
      <h3>&#9998; Edit Registration</h3>
      <form method="POST" action="dashboard.php">
        <input type="hidden" name="action" value="edit">
        <input type="hidden" name="edit_id">

        <div class="form-group">
          <label>Full Name</label>
          <input type="text" name="edit_name" class="form-control" required>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Email</label>
            <input type="email" name="edit_email" class="form-control" required>
          </div>
          <div class="form-group">
            <label>Phone</label>
            <input type="tel" name="edit_phone" class="form-control" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Department</label>
            <select name="edit_department" class="form-control" required>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
              <option value="IT">IT</option>
              <option value="AIDS">AIDS</option>
              <option value="MBA">MBA</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label>Year</label>
            <select name="edit_year" class="form-control" required>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Event</label>
          <select name="edit_event" class="form-control" required>
            <option value="TechFest 2026">TechFest 2026</option>
            <option value="Cultural Night">Cultural Night</option>
            <option value="Sports Meet">Sports Meet</option>
            <option value="Workshop Series">Workshop Series</option>
            <option value="Guest Lecture">Guest Lecture</option>
            <option value="Quiz Competition">Quiz Competition</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary btn-sm" onclick="closeEditModal()">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm">Save Changes</button>
        </div>
      </form>
    </div>
  </div>

  <script src="script.js"></script>
</body>
</html>
