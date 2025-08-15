import os
import sys

if __name__ == "__main__":
    os.chdir("backend")
    from flask.cli import main
    sys.exit(main())
