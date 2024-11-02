import { AlertTriangle, Shield, Scale, FileWarning } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200 pt-8 pb-4 mt-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Warning Banner */}
        <div className="alert alert-warning flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5" />
          <span className="text-xs md:text-sm">
            This service is entirely decorative and performs no actual function.
            Any perceived data transfer is purely coincidental.
          </span>
        </div>

        {/* Responsive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Security Theater */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-xs md:text-sm flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Security Assurance
              </h3>
              <p className="text-xs">
                Your data is protected by our state-of-the-art nothing™
                technology. Files are transferred using an advanced system of
                hopes and dreams.
              </p>
              <div className="card-actions justify-end flex-wrap gap-2">
                <div className="badge badge-outline">Unhackable*</div>
                <div className="badge badge-outline">Unbreakable**</div>
              </div>
            </div>
          </div>

          {/* Legal Nonsense */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-xs md:text-sm flex items-center gap-1">
                <Scale className="w-4 h-4" />
                Legal Information
              </h3>
              <p className="text-xs">
                By using this service, you acknowledge that nothing will happen.
                All warranties, implied or explicit, are purely theoretical
                constructs.
              </p>
              <div className="card-actions justify-end flex-wrap gap-2">
                <div className="badge badge-outline">Legally Void</div>
                <div className="badge badge-outline">Non-Binding</div>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-xs md:text-sm flex items-center gap-1">
                <FileWarning className="w-4 h-4" />
                Technical Specifications
              </h3>
              <p className="text-xs">
                Powered by LocalHost™ and the latest in NULL transfer
                protocols. Guaranteed 0% success rate across all devices.
              </p>
              <div className="card-actions justify-end flex-wrap gap-2">
                <div className="badge badge-outline">404 Ready</div>
                <div className="badge badge-outline">Null Certified</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats stats-vertical shadow w-full mb-8 grid grid-cols-1 md:grid-cols-3 md:stats-horizontal gap-4">
          <div className="stat">
            <div className="stat-title">Files Transferred</div>
            <div className="stat-value">0</div>
            <div className="stat-desc">↗︎ 0% from last month</div>
          </div>
          <div className="stat">
            <div className="stat-title">Success Rate</div>
            <div className="stat-value">0%</div>
            <div className="stat-desc">Consistently maintaining standards</div>
          </div>
          <div className="stat">
            <div className="stat-title">User Satisfaction</div>
            <div className="stat-value">undefined</div>
            <div className="stat-desc">No data available</div>
          </div>
        </div>

        {/* Compliance Section */}
        <div className="divider"></div>
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-2">
            <div className="badge badge-lg">GDPR Compliant*</div>
            <div className="badge badge-lg">ISO -1</div>
            <div className="badge badge-lg">SOC Type 0</div>
          </div>

          <div
            className="tooltip"
            data-tip="Patent Pending: Method and System for Simulating File Transfer Without Actually Transferring Files"
          >
            <span className="text-xs opacity-75 cursor-help">
              Patent Pending: US000000000
            </span>
          </div>

          <p className="text-xs opacity-50">
            © {currentYear} LocalVoid Technologies. No Rights Reserved. All
            Wrongs Reversed.
          </p>

          <div className="text-xs opacity-50">
            * Cannot be hacked because nothing exists to hack
            <br />
            ** Cannot be broken because nothing works to begin with
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
