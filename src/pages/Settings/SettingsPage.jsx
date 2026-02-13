import "./settings.css";

export default function SettingsPage() {
  return (
    <div className="settings-page">
      {/* Left Tabs */}
      <div className="settings-tabs">
        <button className="tab active">General Settings</button>
        <button className="tab">Content Moderation</button>
        <button className="tab">User Verification</button>
        <button className="tab">Notifications</button>
        <button className="tab">Privacy & Security</button>
        <button className="tab">API & Integrations</button>
      </div>

      {/* Right Content */}
      <div className="settings-card">
        <h2>General Settings</h2>

        <div className="form-group">
          <label>Platform Name</label>
          <input type="text" value="LoveLink" />
        </div>

        <div className="form-group">
          <label>Minimum Age Requirement</label>
          <input type="number" />
        </div>

        <div className="form-group">
          <label>Default Match Radius (miles)</label>
          <input type="number" value="50" />
        </div>

        <Toggle
          label="Enable Auto-Moderation"
          description="Automatically flag suspicious content"
          checked
        />

        <Toggle
          label="Require Photo Verification"
          description="All users must verify their identity"
        />

        <Toggle
          label="Allow Location Sharing"
          description="Users can share real-time location"
          checked
        />

        <Toggle
          label="Maintenance Mode"
          description="Disable app access for maintenance"
        />

        <div className="actions">
          <button className="primary">💾 Save Changes</button>
          <button className="secondary">↺ Reset to Default</button>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, description, checked }) {
  return (
    <div className="toggle-row">
      <div>
        <p className="toggle-title">{label}</p>
        <p className="toggle-desc">{description}</p>
      </div>
      <label className="switch">
        <input type="checkbox" defaultChecked={checked} />
        <span className="slider" />
      </label>
    </div>
  );
}
