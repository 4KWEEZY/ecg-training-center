<#
.Synopsis
Activate a Python virtual environment for the current PowerShell session.

.Description
Pushes the python executable for a virtual environment to the front of the
$Env:PATH environment variable and sets the prompt to signify that you are
in a Python virtual environment. Makes use of the command line switches as
well as the `pyvenv.cfg` file values present in the virtual environment.

.Parameter VenvDir
Path to the directory that contains the virtual environment to activate. The
default value for this is the parent of the directory that the Activate.ps1
script is located within.

.Parameter Prompt
The prompt prefix to display when this virtual environment is activated. By
default, this prompt is the name of the virtual environment folder (VenvDir)
surrounded by parentheses and followed by a single space (ie. '(.venv) ').

.Example
Activate.ps1
Activates the Python virtual environment that contains the Activate.ps1 script.

.Example
Activate.ps1 -Verbose
Activates the Python virtual environment that contains the Activate.ps1 script,
and shows extra information about the activation as it executes.

.Example
Activate.ps1 -VenvDir C:\Users\MyUser\Common\.venv
Activates the Python virtual environment located in the specified location.

.Example
Activate.ps1 -Prompt "MyPython"
Activates the Python virtual environment that contains the Activate.ps1 script,
and prefixes the current prompt with the specified string (surrounded in
parentheses) while the virtual environment is active.

.Notes
On Windows, it may be required to enable this Activate.ps1 script by setting the
execution policy for the user. You can do this by issuing the following PowerShell
command:

PS C:\> Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

For more information on Execution Policies: 
https://go.microsoft.com/fwlink/?LinkID=135170

#>
Param(
    [Parameter(Mandatory = $false)]
    [String]
    $VenvDir,
    [Parameter(Mandatory = $false)]
    [String]
    $Prompt
)

<# Function declarations --------------------------------------------------- #>

<#
.Synopsis
Remove all shell session elements added by the Activate script, including the
addition of the virtual environment's Python executable from the beginning of
the PATH variable.

.Parameter NonDestructive
If present, do not remove this function from the global namespace for the
session.

#>
function global:deactivate ([switch]$NonDestructive) {
    # Revert to original values

    # The prior prompt:
    if (Test-Path -Path Function:_OLD_VIRTUAL_PROMPT) {
        Copy-Item -Path Function:_OLD_VIRTUAL_PROMPT -Destination Function:prompt
        Remove-Item -Path Function:_OLD_VIRTUAL_PROMPT
    }

    # The prior PYTHONHOME:
    if (Test-Path -Path Env:_OLD_VIRTUAL_PYTHONHOME) {
        Copy-Item -Path Env:_OLD_VIRTUAL_PYTHONHOME -Destination Env:PYTHONHOME
        Remove-Item -Path Env:_OLD_VIRTUAL_PYTHONHOME
    }

    # The prior PATH:
    if (Test-Path -Path Env:_OLD_VIRTUAL_PATH) {
        Copy-Item -Path Env:_OLD_VIRTUAL_PATH -Destination Env:PATH
        Remove-Item -Path Env:_OLD_VIRTUAL_PATH
    }

    # Just remove the VIRTUAL_ENV altogether:
    if (Test-Path -Path Env:VIRTUAL_ENV) {
        Remove-Item -Path env:VIRTUAL_ENV
    }

    # Just remove VIRTUAL_ENV_PROMPT altogether.
    if (Test-Path -Path Env:VIRTUAL_ENV_PROMPT) {
        Remove-Item -Path env:VIRTUAL_ENV_PROMPT
    }

    # Just remove the _PYTHON_VENV_PROMPT_PREFIX altogether:
    if (Get-Variable -Name "_PYTHON_VENV_PROMPT_PREFIX" -ErrorAction SilentlyContinue) {
        Remove-Variable -Name _PYTHON_VENV_PROMPT_PREFIX -Scope Global -Force
    }

    # Leave deactivate function in the global namespace if requested:
    if (-not $NonDestructive) {
        Remove-Item -Path function:deactivate
    }
}

<#
.Description
Get-PyVenvConfig parses the values from the pyvenv.cfg file located in the
given folder, and returns them in a map.

For each line in the pyvenv.cfg file, if that line can be parsed into exactly
two strings separated by `=` (with any amount of whitespace surrounding the =)
then it is considered a `key = value` line. The left hand string is the key,
the right hand is the value.

If the value starts with a `'` or a `"` then the first and last character is
stripped from the value before being captured.

.Parameter ConfigDir
Path to the directory that contains the `pyvenv.cfg` file.
#>
function Get-PyVenvConfig(
    [String]
    $ConfigDir
) {
    Write-Verbose "Given ConfigDir=$ConfigDir, obtain values in pyvenv.cfg"

    # Ensure the file exists, and issue a warning if it doesn't (but still allow the function to continue).
    $pyvenvConfigPath = Join-Path -Resolve -Path $ConfigDir -ChildPath 'pyvenv.cfg' -ErrorAction Continue

    # An empty map will be returned if no config file is found.
    $pyvenvConfig = @{ }

    if ($pyvenvConfigPath) {

        Write-Verbose "File exists, parse `key = value` lines"
        $pyvenvConfigContent = Get-Content -Path $pyvenvConfigPath

        $pyvenvConfigContent | ForEach-Object {
            $keyval = $PSItem -split "\s*=\s*", 2
            if ($keyval[0] -and $keyval[1]) {
                $val = $keyval[1]

                # Remove extraneous quotations around a string value.
                if ("'""".Contains($val.Substring(0, 1))) {
                    $val = $val.Substring(1, $val.Length - 2)
                }

                $pyvenvConfig[$keyval[0]] = $val
                Write-Verbose "Adding Key: '$($keyval[0])'='$val'"
            }
        }
    }
    return $pyvenvConfig
}


<# Begin Activate script --------------------------------------------------- #>

# Determine the containing directory of this script
$VenvExecPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$VenvExecDir = Get-Item -Path $VenvExecPath

Write-Verbose "Activation script is located in path: '$VenvExecPath'"
Write-Verbose "VenvExecDir Fullname: '$($VenvExecDir.FullName)"
Write-Verbose "VenvExecDir Name: '$($VenvExecDir.Name)"

# Set values required in priority: CmdLine, ConfigFile, Default
# First, get the location of the virtual environment, it might not be
# VenvExecDir if specified on the command line.
if ($VenvDir) {
    Write-Verbose "VenvDir given as parameter, using '$VenvDir' to determine values"
}
else {
    Write-Verbose "VenvDir not given as a parameter, using parent directory name as VenvDir."
    $VenvDir = $VenvExecDir.Parent.FullName.TrimEnd("\\/")
    Write-Verbose "VenvDir=$VenvDir"
}

# Next, read the `pyvenv.cfg` file to determine any required value such
# as `prompt`.
$pyvenvCfg = Get-PyVenvConfig -ConfigDir $VenvDir

# Next, set the prompt from the command line, or the config file, or
# just use the name of the virtual environment folder.
if ($Prompt) {
    Write-Verbose "Prompt specified as argument, using '$Prompt'"
}
else {
    Write-Verbose "Prompt not specified as argument to script, checking pyvenv.cfg value"
    if ($pyvenvCfg -and $pyvenvCfg['prompt']) {
        Write-Verbose "  Setting based on value in pyvenv.cfg='$($pyvenvCfg['prompt'])'"
        $Prompt = $pyvenvCfg['prompt'];
    }
    else {
        Write-Verbose "  Setting prompt based on parent's directory's name. (Is the directory name passed to venv module when creating the virtual environment)"
        Write-Verbose "  Got leaf-name of $VenvDir='$(Split-Path -Path $venvDir -Leaf)'"
        $Prompt = Split-Path -Path $venvDir -Leaf
    }
}

Write-Verbose "Prompt = '$Prompt'"
Write-Verbose "VenvDir='$VenvDir'"

# Deactivate any currently active virtual environment, but leave the
# deactivate function in place.
deactivate -nondestructive

# Now set the environment variable VIRTUAL_ENV, used by many tools to determine
# that there is an activated venv.
$env:VIRTUAL_ENV = $VenvDir

<<<<<<< HEAD
$env:VIRTUAL_ENV_PROMPT = $Prompt

=======
>>>>>>> bdbda7fd3df8b65569c06f79a6ea93536ec6ea2e
if (-not $Env:VIRTUAL_ENV_DISABLE_PROMPT) {

    Write-Verbose "Setting prompt to '$Prompt'"

    # Set the prompt to include the env name
    # Make sure _OLD_VIRTUAL_PROMPT is global
    function global:_OLD_VIRTUAL_PROMPT { "" }
    Copy-Item -Path function:prompt -Destination function:_OLD_VIRTUAL_PROMPT
    New-Variable -Name _PYTHON_VENV_PROMPT_PREFIX -Description "Python virtual environment prompt prefix" -Scope Global -Option ReadOnly -Visibility Public -Value $Prompt

    function global:prompt {
        Write-Host -NoNewline -ForegroundColor Green "($_PYTHON_VENV_PROMPT_PREFIX) "
        _OLD_VIRTUAL_PROMPT
    }
<<<<<<< HEAD
=======
    $env:VIRTUAL_ENV_PROMPT = $Prompt
>>>>>>> bdbda7fd3df8b65569c06f79a6ea93536ec6ea2e
}

# Clear PYTHONHOME
if (Test-Path -Path Env:PYTHONHOME) {
    Copy-Item -Path Env:PYTHONHOME -Destination Env:_OLD_VIRTUAL_PYTHONHOME
    Remove-Item -Path Env:PYTHONHOME
}

# Add the venv to the PATH
Copy-Item -Path Env:PATH -Destination Env:_OLD_VIRTUAL_PATH
$Env:PATH = "$VenvExecDir$([System.IO.Path]::PathSeparator)$Env:PATH"

# SIG # Begin signature block
<<<<<<< HEAD
# MII27wYJKoZIhvcNAQcCoII24DCCNtwCAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBALKwKRFIhr2RY
# IW/WJLd9pc8a9sj/IoThKU92fTfKsKCCG1wwggXMMIIDtKADAgECAhBUmNLR1FsZ
# lUgTecgRwIeZMA0GCSqGSIb3DQEBDAUAMHcxCzAJBgNVBAYTAlVTMR4wHAYDVQQK
# ExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xSDBGBgNVBAMTP01pY3Jvc29mdCBJZGVu
# dGl0eSBWZXJpZmljYXRpb24gUm9vdCBDZXJ0aWZpY2F0ZSBBdXRob3JpdHkgMjAy
# MDAeFw0yMDA0MTYxODM2MTZaFw00NTA0MTYxODQ0NDBaMHcxCzAJBgNVBAYTAlVT
# MR4wHAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xSDBGBgNVBAMTP01pY3Jv
# c29mdCBJZGVudGl0eSBWZXJpZmljYXRpb24gUm9vdCBDZXJ0aWZpY2F0ZSBBdXRo
# b3JpdHkgMjAyMDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBALORKgeD
# Bmf9np3gx8C3pOZCBH8Ppttf+9Va10Wg+3cL8IDzpm1aTXlT2KCGhFdFIMeiVPvH
# or+Kx24186IVxC9O40qFlkkN/76Z2BT2vCcH7kKbK/ULkgbk/WkTZaiRcvKYhOuD
# PQ7k13ESSCHLDe32R0m3m/nJxxe2hE//uKya13NnSYXjhr03QNAlhtTetcJtYmrV
# qXi8LW9J+eVsFBT9FMfTZRY33stuvF4pjf1imxUs1gXmuYkyM6Nix9fWUmcIxC70
# ViueC4fM7Ke0pqrrBc0ZV6U6CwQnHJFnni1iLS8evtrAIMsEGcoz+4m+mOJyoHI1
# vnnhnINv5G0Xb5DzPQCGdTiO0OBJmrvb0/gwytVXiGhNctO/bX9x2P29Da6SZEi3
# W295JrXNm5UhhNHvDzI9e1eM80UHTHzgXhgONXaLbZ7LNnSrBfjgc10yVpRnlyUK
# xjU9lJfnwUSLgP3B+PR0GeUw9gb7IVc+BhyLaxWGJ0l7gpPKWeh1R+g/OPTHU3mg
# trTiXFHvvV84wRPmeAyVWi7FQFkozA8kwOy6CXcjmTimthzax7ogttc32H83rwjj
# O3HbbnMbfZlysOSGM1l0tRYAe1BtxoYT2v3EOYI9JACaYNq6lMAFUSw0rFCZE4e7
# swWAsk0wAly4JoNdtGNz764jlU9gKL431VulAgMBAAGjVDBSMA4GA1UdDwEB/wQE
# AwIBhjAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTIftJqhSobyhmYBAcnz1AQ
# T2ioojAQBgkrBgEEAYI3FQEEAwIBADANBgkqhkiG9w0BAQwFAAOCAgEAr2rd5hnn
# LZRDGU7L6VCVZKUDkQKL4jaAOxWiUsIWGbZqWl10QzD0m/9gdAmxIR6QFm3FJI9c
# Zohj9E/MffISTEAQiwGf2qnIrvKVG8+dBetJPnSgaFvlVixlHIJ+U9pW2UYXeZJF
# xBA2CFIpF8svpvJ+1Gkkih6PsHMNzBxKq7Kq7aeRYwFkIqgyuH4yKLNncy2RtNwx
# AQv3Rwqm8ddK7VZgxCwIo3tAsLx0J1KH1r6I3TeKiW5niB31yV2g/rarOoDXGpc8
# FzYiQR6sTdWD5jw4vU8w6VSp07YEwzJ2YbuwGMUrGLPAgNW3lbBeUU0i/OxYqujY
# lLSlLu2S3ucYfCFX3VVj979tzR/SpncocMfiWzpbCNJbTsgAlrPhgzavhgplXHT2
# 6ux6anSg8Evu75SjrFDyh+3XOjCDyft9V77l4/hByuVkrrOj7FjshZrM77nq81YY
# uVxzmq/FdxeDWds3GhhyVKVB0rYjdaNDmuV3fJZ5t0GNv+zcgKCf0Xd1WF81E+Al
# GmcLfc4l+gcK5GEh2NQc5QfGNpn0ltDGFf5Ozdeui53bFv0ExpK91IjmqaOqu/dk
# ODtfzAzQNb50GQOmxapMomE2gj4d8yu8l13bS3g7LfU772Aj6PXsCyM2la+YZr9T
# 03u4aUoqlmZpxJTG9F9urJh4iIAGXKKy7aIwgga6MIIEoqADAgECAhMzAADydIm6
# z//amAtvAAAAAPJ0MA0GCSqGSIb3DQEBDAUAMFoxCzAJBgNVBAYTAlVTMR4wHAYD
# VQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xKzApBgNVBAMTIk1pY3Jvc29mdCBJ
# RCBWZXJpZmllZCBDUyBFT0MgQ0EgMDMwHhcNMjYwNTEwMDcyMDEwWhcNMjYwNTEz
# MDcyMDEwWjB8MQswCQYDVQQGEwJVUzEPMA0GA1UECBMGT3JlZ29uMRIwEAYDVQQH
# EwlCZWF2ZXJ0b24xIzAhBgNVBAoTGlB5dGhvbiBTb2Z0d2FyZSBGb3VuZGF0aW9u
# MSMwIQYDVQQDExpQeXRob24gU29mdHdhcmUgRm91bmRhdGlvbjCCAaIwDQYJKoZI
# hvcNAQEBBQADggGPADCCAYoCggGBALQF2GqwzKjWRhy9k/k515TCt2Sga7n8kPuQ
# ZbXrDefy8cHZv1ZgajS/NgeRt/l0t03HhR1fB1Mp+bF9GR1vPK1L7T2qIh2iX/f6
# we1FffO9pAPoEThDc7mjUreTPVmSGO+s36SZIh8Qvx08dDKe+epYM0RO2TPlxa+g
# gvh2pIlAsn6X8EiXDWqVSPIc0dlr294iWRs179fRgheGKgyK8jxwByDWQDD22Z16
# DI0ZFcD8gzIB/SdZoSc9r1WuA6pVVyjbblR+J50DwBLYiEL26HT5VsjbHpw/86sA
# Va+rRRxVnu2jKIAIGncytkQb52MJx1zqvCTH1nMLnuxnehZ7k0LsiW+6SEdrawHW
# lM8aEvSov6HpbmjWP5PtRKbWRgy5MqQJximpAxmXyom5Y86os2X9+B+LU1sTzs2q
# pot8RTaEryxJN3jHG6/aWxsW1YUPechI7xnsqn8WMDNUnl4jrFA6d2igjvHcMDD8
# MCW3BrqYTE7n8bfDutfBJsUVJcV1MwIDAQABo4IB1TCCAdEwDAYDVR0TAQH/BAIw
# ADAOBgNVHQ8BAf8EBAMCB4AwPAYDVR0lBDUwMwYKKwYBBAGCN2EBAAYIKwYBBQUH
# AwMGGysGAQQBgjdhgqKNuwqmkohkgZH0oEWCk/3hbzAdBgNVHQ4EFgQUi6noeL0r
# A8HhpyTM1dbnl+rpQKAwHwYDVR0jBBgwFoAUa16lNMMFxWJKIVqOq3NgYtSsY4Uw
# ZwYDVR0fBGAwXjBcoFqgWIZWaHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9w
# cy9jcmwvTWljcm9zb2Z0JTIwSUQlMjBWZXJpZmllZCUyMENTJTIwRU9DJTIwQ0El
# MjAwMy5jcmwwdAYIKwYBBQUHAQEEaDBmMGQGCCsGAQUFBzAChlhodHRwOi8vd3d3
# Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NlcnRzL01pY3Jvc29mdCUyMElEJTIwVmVy
# aWZpZWQlMjBDUyUyMEVPQyUyMENBJTIwMDMuY3J0MFQGA1UdIARNMEswSQYEVR0g
# ADBBMD8GCCsGAQUFBwIBFjNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3Bz
# L0RvY3MvUmVwb3NpdG9yeS5odG0wDQYJKoZIhvcNAQEMBQADggIBAA4TdsyNQTf8
# ZoLR9H48fm26FfSuiEmv0xRV4OT66mkTVzktaltViKLl3UzkU2gcFQ4zgIc1F9MG
# u3NiZfocLBPT7DSqN1/ZXn7QW7otuyeNg+0mUhsvL7QlUbeUdedxkh9ykkr/lPp6
# qPQBU3+YTiZ8cgdTfsGCWf0oWC/FppRG/FVPxk12eLYjpV8hnmvLKLHaW6cMzKC5
# vUFDOZ3ARral5DCCEkDqeHi8F/GfXkewz2gmnwe+d1F/JYvXit4a5pR7iiXNcCfh
# /CGZ0PkGGddQbdI7setyS6T4MBiTHhMlWH7vvBLrMOY0isbsbmKZKQ7E5kWH6A8N
# dogBv+08ZKDlHEESqMtx3sbayGldJroLQQgDDj4542TRo58WoOzeTH+E0Zgxn3me
# 3sZjDCYLxDtugj2teS2tkalfBORU3knYiux+0Q6BYyr+W9sO4rRxTSap8TzLVAUU
# BbcNUbm4T+/ofnB2dzREc5qcSlwsLh/747lNpggrtLJ89EHPD4zu0bysYQ7XSRCp
# 7SmfWORWxPtQpaklRoOrCo5mn8R3pLTEOcWsbig+/5XTEYhzmr5R0MyNIvUGWPeY
# Kvxyz+Ih0KMnquemC5UzSNU6sdK9tFDEIu0TWoFlGnHCm0nBwEsrmR4WBE40FyQ6
# mHMU2VD6gLvQ3PaYoT2uwGQZcYZVrQdiMIIHKDCCBRCgAwIBAgITMwAAABUFPm4Z
# jpMp2QAAAAAAFTANBgkqhkiG9w0BAQwFADBjMQswCQYDVQQGEwJVUzEeMBwGA1UE
# ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTQwMgYDVQQDEytNaWNyb3NvZnQgSUQg
# VmVyaWZpZWQgQ29kZSBTaWduaW5nIFBDQSAyMDIxMB4XDTI2MDMyNjE4MTEyOFoX
# DTMxMDMyNjE4MTEyOFowWjELMAkGA1UEBhMCVVMxHjAcBgNVBAoTFU1pY3Jvc29m
# dCBDb3Jwb3JhdGlvbjErMCkGA1UEAxMiTWljcm9zb2Z0IElEIFZlcmlmaWVkIENT
# IEVPQyBDQSAwMzCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAOD0yz0C
# qi8Ocx4+8w574rJuEJ3z6WiTNg5GVLeQFVex55xvIbAFyx6eWblsu0wY+OIgUvMF
# AX6CGVVX9Tb2rkZx14QQEIdNMaEvaSgistzhSuWIxFxu/2Y4y1H+Xv/ECa/QXHgE
# kefV0e3ft++sGpeYqMp8Z/kOnI7/6GdXtMSt4y1LX2I75uNn/0eemDc8KTR7thJt
# FMWTH3sVnBFakLizc16lF9FdCH9YwCPsmaxh5VmiGLhMXnJbYkyslmrAdzLMlli0
# PYeWejlkQmR2JlwRrEc6hubA7TpnUn1zbemz08YiEZqrWwosQDP0OhzmsuRhYa14
# OuxwqECnaQhz+hiUf0iPoGQ6qqBYg0SQS0Lxk0bUxqT6HejrlqPSJAqZ3Fbshloc
# 7ly7KgyL4q1h9d4giDexUhtLYQvyRS2wMZ0So2oCr+KypOLWNeot7qIqnWeLVI92
# 89b0bTcJOxgXrxv/K4hBHBt2gEJd6Yw0kJLR2isJFjhvZYADLieDtIA1wSCsGBl/
# nfn5B8tTmEbOsqMilsxptq5ZvkUpZQqQyw9xcWRdFY7iego+bgpaUXKmo6lsn8o4
# 1VF4iXEdBF6AA4HMiFEHuCv0gNDWxzYyA6BD7FUZbiirgcPSZ8CLCLIuyRmuRpDs
# mhqdiME1xH1FLbpjEBVtwG0uK0VPMIgSDll1AgMBAAGjggHcMIIB2DAOBgNVHQ8B
# Af8EBAMCAYYwEAYJKwYBBAGCNxUBBAMCAQAwHQYDVR0OBBYEFGtepTTDBcViSiFa
# jqtzYGLUrGOFMFQGA1UdIARNMEswSQYEVR0gADBBMD8GCCsGAQUFBwIBFjNodHRw
# Oi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL0RvY3MvUmVwb3NpdG9yeS5odG0w
# GQYJKwYBBAGCNxQCBAweCgBTAHUAYgBDAEEwEgYDVR0TAQH/BAgwBgEB/wIBADAf
# BgNVHSMEGDAWgBTZQSmwDw9jbO9p1/XNKZ6kSGow5jBwBgNVHR8EaTBnMGWgY6Bh
# hl9odHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NybC9NaWNyb3NvZnQl
# MjBJRCUyMFZlcmlmaWVkJTIwQ29kZSUyMFNpZ25pbmclMjBQQ0ElMjAyMDIxLmNy
# bDB9BggrBgEFBQcBAQRxMG8wbQYIKwYBBQUHMAKGYWh0dHA6Ly93d3cubWljcm9z
# b2Z0LmNvbS9wa2lvcHMvY2VydHMvTWljcm9zb2Z0JTIwSUQlMjBWZXJpZmllZCUy
# MENvZGUlMjBTaWduaW5nJTIwUENBJTIwMjAyMS5jcnQwDQYJKoZIhvcNAQEMBQAD
# ggIBAF1uIjzPBctfyCUkSH/xDbZQwJSFYE7jpn0U+HA5HeZ2WpFUuRg6if8xzNTC
# uMOHHdf31I8fk9J+WQahO+c71lYczlgVVik7s1i4H6Z9VIYAZnCIY4BJaTSLYHu+
# f2cSUkmaiJfG6B8flh0GytSBO3QAU1eTOapOCT5LUfFvW7/QcKoQdVk+TYD/p4ld
# hu2lEzkVzPTSOKxSX0FFmBJ5s4NXzlsHM696rILd/Q+ccLFEk2ExvzE/+wH9Ujul
# /auF5JXvOpRK/y+f98gxuVd5pUiWmqirxI/0EkyMT8KhVcnGeRlBEzUVruQ33LO2
# 9F46HFKA+ClnH9eX+OTDIQVUlMF8GnexOB8hz+maq/Z6G1qQvYASPvwSY49CiHEl
# PfDJf4/vwYDbm0ukC/OPdEwwd3zPXxm65WL7rQwDMak4BIfUvw2Wvd9lFmdA76nL
# J7YMK9iYdoh91SBgmqfuejHEZW/z35FoROHW2AIO/A2kUJIbu+XkDhqSj7Z/HjT2
# v1NaNcLs6J/UhDlknMHhF/wa8GIdiO8yYemV52nUUZEt1JEVWkLf84qlljpq8ipm
# nv7yk/9ZA/3TcN2Cu8BPpbjE84HFc9ri0aSw3dK6olqIVgdI3J4G5+fyKx66Nbgh
# sFJscPgE+psXepn7ucb13938bb8vHiQf1wKYF+axl1KQea6QMIIHnjCCBYagAwIB
# AgITMwAAAAeHozSje6WOHAAAAAAABzANBgkqhkiG9w0BAQwFADB3MQswCQYDVQQG
# EwJVUzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMUgwRgYDVQQDEz9N
# aWNyb3NvZnQgSWRlbnRpdHkgVmVyaWZpY2F0aW9uIFJvb3QgQ2VydGlmaWNhdGUg
# QXV0aG9yaXR5IDIwMjAwHhcNMjEwNDAxMjAwNTIwWhcNMzYwNDAxMjAxNTIwWjBj
# MQswCQYDVQQGEwJVUzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTQw
# MgYDVQQDEytNaWNyb3NvZnQgSUQgVmVyaWZpZWQgQ29kZSBTaWduaW5nIFBDQSAy
# MDIxMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsvDArxmIKOLdVHpM
# SWxpCFUJtFL/ekr4weslKPdnF3cpTeuV8veqtmKVgok2rO0D05BpyvUDCg1wdsoE
# tuxACEGcgHfjPF/nZsOkg7c0mV8hpMT/GvB4uhDvWXMIeQPsDgCzUGzTvoi76YDp
# xDOxhgf8JuXWJzBDoLrmtThX01CE1TCCvH2sZD/+Hz3RDwl2MsvDSdX5rJDYVuR3
# bjaj2QfzZFmwfccTKqMAHlrz4B7ac8g9zyxlTpkTuJGtFnLBGasoOnn5NyYlf0xF
# 9/bjVRo4Gzg2Yc7KR7yhTVNiuTGH5h4eB9ajm1OCShIyhrKqgOkc4smz6obxO+Hx
# KeJ9bYmPf6KLXVNLz8UaeARo0BatvJ82sLr2gqlFBdj1sYfqOf00Qm/3B4XGFPDK
# /H04kteZEZsBRc3VT2d/iVd7OTLpSH9yCORV3oIZQB/Qr4nD4YT/lWkhVtw2v2s0
# TnRJubL/hFMIQa86rcaGMhNsJrhysLNNMeBhiMezU1s5zpusf54qlYu2v5sZ5zL0
# KvBDLHtL8F9gn6jOy3v7Jm0bbBHjrW5yQW7S36ALAt03QDpwW1JG1Hxu/FUXJbBO
# 2AwwVG4Fre+ZQ5Od8ouwt59FpBxVOBGfN4vN2m3fZx1gqn52GvaiBz6ozorgIEjn
# +PhUXILhAV5Q/ZgCJ0u2+ldFGjcCAwEAAaOCAjUwggIxMA4GA1UdDwEB/wQEAwIB
# hjAQBgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4EFgQU2UEpsA8PY2zvadf1zSmepEhq
# MOYwVAYDVR0gBE0wSzBJBgRVHSAAMEEwPwYIKwYBBQUHAgEWM2h0dHA6Ly93d3cu
# bWljcm9zb2Z0LmNvbS9wa2lvcHMvRG9jcy9SZXBvc2l0b3J5Lmh0bTAZBgkrBgEE
# AYI3FAIEDB4KAFMAdQBiAEMAQTAPBgNVHRMBAf8EBTADAQH/MB8GA1UdIwQYMBaA
# FMh+0mqFKhvKGZgEByfPUBBPaKiiMIGEBgNVHR8EfTB7MHmgd6B1hnNodHRwOi8v
# d3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NybC9NaWNyb3NvZnQlMjBJZGVudGl0
# eSUyMFZlcmlmaWNhdGlvbiUyMFJvb3QlMjBDZXJ0aWZpY2F0ZSUyMEF1dGhvcml0
# eSUyMDIwMjAuY3JsMIHDBggrBgEFBQcBAQSBtjCBszCBgQYIKwYBBQUHMAKGdWh0
# dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvY2VydHMvTWljcm9zb2Z0JTIw
# SWRlbnRpdHklMjBWZXJpZmljYXRpb24lMjBSb290JTIwQ2VydGlmaWNhdGUlMjBB
# dXRob3JpdHklMjAyMDIwLmNydDAtBggrBgEFBQcwAYYhaHR0cDovL29uZW9jc3Au
# bWljcm9zb2Z0LmNvbS9vY3NwMA0GCSqGSIb3DQEBDAUAA4ICAQB/JSqe/tSr6t1m
# CttXI0y6XmyQ41uGWzl9xw+WYhvOL47BV09Dgfnm/tU4ieeZ7NAR5bguorTCNr58
# HOcA1tcsHQqt0wJsdClsu8bpQD9e/al+lUgTUJEV80Xhco7xdgRrehbyhUf4pkeA
# hBEjABvIUpD2LKPho5Z4DPCT5/0TlK02nlPwUbv9URREhVYCtsDM+31OFU3fDV8B
# mQXv5hT2RurVsJHZgP4y26dJDVF+3pcbtvh7R6NEDuYHYihfmE2HdQRq5jRvLE1E
# b59PYwISFCX2DaLZ+zpU4bX0I16ntKq4poGOFaaKtjIA1vRElItaOKcwtc04CBrX
# SfyL2Op6mvNIxTk4OaswIkTXbFL81ZKGD+24uMCwo/pLNhn7VHLfnxlMVzHQVL+b
# Ha9KhTyzwdG/L6uderJQn0cGpLQMStUuNDArxW2wF16QGZ1NtBWgKA8Kqv48M8Hf
# FqNifN6+zt6J0GwzvU8g0rYGgTZR8zDEIJfeZxwWDHpSxB5FJ1VVU1LIAtB7o9PX
# bjXzGifaIMYTzU4YKt4vMNwwBmetQDHhdAtTPplOXrnI9SI6HeTtjDD3iUN/7ygb
# ahmYOHk7VB7fwT4ze+ErCbMh6gHV1UuXPiLciloNxH6K4aMfZN1oLVk6YFeIJEok
# uPgNPa6EnTiOL60cPqfny+Fq8UiuZzGCGukwghrlAgEBMHEwWjELMAkGA1UEBhMC
# VVMxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlvbjErMCkGA1UEAxMiTWlj
# cm9zb2Z0IElEIFZlcmlmaWVkIENTIEVPQyBDQSAwMwITMwAA8nSJus//2pgLbwAA
# AADydDANBglghkgBZQMEAgEFAKCBsjAZBgkqhkiG9w0BCQMxDAYKKwYBBAGCNwIB
# BDAcBgorBgEEAYI3AgELMQ4wDAYKKwYBBAGCNwIBFTAvBgkqhkiG9w0BCQQxIgQg
# Kld7dFLdvZygPQIm94QeWCWq09RhnYWpKs5R8/oLpjgwRgYKKwYBBAGCNwIBDDE4
# MDagMIAuAFAAeQB0AGgAbwBuACAAMwAuADEANAAuADUAIAAoADUANgAwADcAOQA1
# ADAAKaECgAAwDQYJKoZIhvcNAQEBBQAEggGASN/aq7JPTMZelBLQ2QTq3ZChSfX3
# Juf1PxlJQJAqxbkYVmgig+SWrVCjJU3bUxOHr+Z0DFh4/GBztD3XvT8RoFxjqDDe
# PhiGlwoMTrSegdqK1wfk6vTM40GUv9l15ljJ9TIvvzOsTbVoZgfFCG+vgTE7spg0
# y+o1iZ1VA1/wIgd/eQfUrZf2UYwd1Gu6Lu8VQuYXTV5J3ykyqxXvm59EWI5fw5Ks
# JU4xtQtV/VglBhnI5/h9jlNJa6bjbgKig1iZqNa1NLo903+J8E791bnF3zOJWfkJ
# HdlCxjPgZWTzhIxUTGtzv+ieNDgS+G5ZII7ChQ2Mhvy44yzZYV67d/G2g4QiWZ2P
# v7KMSmnbTkgzTAKrl7Xr5mHpWfhnmKHoMhpOc/kZ/fRXQnPp8DZ1C3Fe+6I46U1g
# c/7T0RvNTUkTxeOkTVm/RSZO7rlskrPvkr8YLjBiVrY20XuVCzxN1q4cu1nms3Tb
# hN6397Noa43rcu7yv/YiwEGKqLC8FWw2QG4ioYIYFDCCGBAGCisGAQQBgjcDAwEx
# ghgAMIIX/AYJKoZIhvcNAQcCoIIX7TCCF+kCAQMxDzANBglghkgBZQMEAgEFADCC
# AWIGCyqGSIb3DQEJEAEEoIIBUQSCAU0wggFJAgEBBgorBgEEAYRZCgMBMDEwDQYJ
# YIZIAWUDBAIBBQAEIDlGYOV+tzFD1ZdIPsnxLuPRSnY23uv6MgI2kVkGv8ENAgZp
# 512RtMwYEzIwMjYwNTEwMTEzNjUzLjQzMVowBIACAfSggeGkgd4wgdsxCzAJBgNV
# BAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
# HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xJTAjBgNVBAsTHE1pY3Jvc29m
# dCBBbWVyaWNhIE9wZXJhdGlvbnMxJzAlBgNVBAsTHm5TaGllbGQgVFNTIEVTTjpB
# NTAwLTA1RTAtRDk0NzE1MDMGA1UEAxMsTWljcm9zb2Z0IFB1YmxpYyBSU0EgVGlt
# ZSBTdGFtcGluZyBBdXRob3JpdHmggg8hMIIHgjCCBWqgAwIBAgITMwAAAAXlzw//
# Zi7JhwAAAAAABTANBgkqhkiG9w0BAQwFADB3MQswCQYDVQQGEwJVUzEeMBwGA1UE
# ChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMUgwRgYDVQQDEz9NaWNyb3NvZnQgSWRl
# bnRpdHkgVmVyaWZpY2F0aW9uIFJvb3QgQ2VydGlmaWNhdGUgQXV0aG9yaXR5IDIw
# MjAwHhcNMjAxMTE5MjAzMjMxWhcNMzUxMTE5MjA0MjMxWjBhMQswCQYDVQQGEwJV
# UzEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQDEylNaWNy
# b3NvZnQgUHVibGljIFJTQSBUaW1lc3RhbXBpbmcgQ0EgMjAyMDCCAiIwDQYJKoZI
# hvcNAQEBBQADggIPADCCAgoCggIBAJ5851Jj/eDFnwV9Y7UGIqMcHtfnlzPREwW9
# ZUZHd5HBXXBvf7KrQ5cMSqFSHGqg2/qJhYqOQxwuEQXG8kB41wsDJP5d0zmLYKAY
# 8Zxv3lYkuLDsfMuIEqvGYOPURAH+Ybl4SJEESnt0MbPEoKdNihwM5xGv0rGofJ1q
# OYSTNcc55EbBT7uq3wx3mXhtVmtcCEr5ZKTkKKE1CxZvNPWdGWJUPC6e4uRfWHIh
# ZcgCsJ+sozf5EeH5KrlFnxpjKKTavwfFP6XaGZGWUG8TZaiTogRoAlqcevbiqioU
# z1Yt4FRK53P6ovnUfANjIgM9JDdJ4e0qiDRm5sOTiEQtBLGd9Vhd1MadxoGcHrRC
# sS5rO9yhv2fjJHrmlQ0EIXmp4DhDBieKUGR+eZ4CNE3ctW4uvSDQVeSp9h1SaPV8
# UWEfyTxgGjOsRpeexIveR1MPTVf7gt8hY64XNPO6iyUGsEgt8c2PxF87E+CO7A28
# TpjNq5eLiiunhKbq0XbjkNoU5JhtYUrlmAbpxRjb9tSreDdtACpm3rkpxp7AQndn
# I0Shu/fk1/rE3oWsDqMX3jjv40e8KN5YsJBnczyWB4JyeeFMW3JBfdeAKhzohFe8
# U5w9WuvcP1E8cIxLoKSDzCCBOu0hWdjzKNu8Y5SwB1lt5dQhABYyzR3dxEO/T1K/
# BVF3rV69AgMBAAGjggIbMIICFzAOBgNVHQ8BAf8EBAMCAYYwEAYJKwYBBAGCNxUB
# BAMCAQAwHQYDVR0OBBYEFGtpKDo1L0hjQM972K9J6T7ZPdshMFQGA1UdIARNMEsw
# SQYEVR0gADBBMD8GCCsGAQUFBwIBFjNodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
# cGtpb3BzL0RvY3MvUmVwb3NpdG9yeS5odG0wEwYDVR0lBAwwCgYIKwYBBQUHAwgw
# GQYJKwYBBAGCNxQCBAweCgBTAHUAYgBDAEEwDwYDVR0TAQH/BAUwAwEB/zAfBgNV
# HSMEGDAWgBTIftJqhSobyhmYBAcnz1AQT2ioojCBhAYDVR0fBH0wezB5oHegdYZz
# aHR0cDovL3d3dy5taWNyb3NvZnQuY29tL3BraW9wcy9jcmwvTWljcm9zb2Z0JTIw
# SWRlbnRpdHklMjBWZXJpZmljYXRpb24lMjBSb290JTIwQ2VydGlmaWNhdGUlMjBB
# dXRob3JpdHklMjAyMDIwLmNybDCBlAYIKwYBBQUHAQEEgYcwgYQwgYEGCCsGAQUF
# BzAChnVodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3BzL2NlcnRzL01pY3Jv
# c29mdCUyMElkZW50aXR5JTIwVmVyaWZpY2F0aW9uJTIwUm9vdCUyMENlcnRpZmlj
# YXRlJTIwQXV0aG9yaXR5JTIwMjAyMC5jcnQwDQYJKoZIhvcNAQEMBQADggIBAF+I
# dsd+bbVaFXXnTHho+k7h2ESZJRWluLE0Oa/pO+4ge/XEizXvhs0Y7+KVYyb4nHlu
# gBesnFqBGEdC2IWmtKMyS1OWIviwpnK3aL5JedwzbeBF7POyg6IGG/XhhJ3UqWeW
# TO+Czb1c2NP5zyEh89F72u9UIw+IfvM9lzDmc2O2END7MPnrcjWdQnrLn1Ntday7
# JSyrDvBdmgbNnCKNZPmhzoa8PccOiQljjTW6GePe5sGFuRHzdFt8y+bN2neF7Zu8
# hTO1I64XNGqst8S+w+RUdie8fXC1jKu3m9KGIqF4aldrYBamyh3g4nJPj/LR2CBa
# LyD+2BuGZCVmoNR/dSpRCxlot0i79dKOChmoONqbMI8m04uLaEHAv4qwKHQ1vBzb
# V/nG89LDKbRSSvijmwJwxRxLLpMQ/u4xXxFfR4f/gksSkbJp7oqLwliDm/h+w0aJ
# /U5ccnYhYb7vPKNMN+SZDWycU5ODIRfyoGl59BsXR/HpRGtiJquOYGmvA/pk5vC1
# lcnbeMrcWD/26ozePQ/TWfNXKBOmkFpvPE8CH+EeGGWzqTCjdAsno2jzTeNSxlx3
# glDGJgcdz5D/AAxw9Sdgq/+rY7jjgs7X6fqPTXPmaCAJKVHAP19oEjJIBwD1LyHb
# aEgBxFCogYSOiUIr0Xqcr1nJfiWG2GwYe6ZoAF1bMIIHlzCCBX+gAwIBAgITMwAA
# AFZ+j51YCI7pYAAAAAAAVjANBgkqhkiG9w0BAQwFADBhMQswCQYDVQQGEwJVUzEe
# MBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQDEylNaWNyb3Nv
# ZnQgUHVibGljIFJTQSBUaW1lc3RhbXBpbmcgQ0EgMjAyMDAeFw0yNTEwMjMyMDQ2
# NTFaFw0yNjEwMjIyMDQ2NTFaMIHbMQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2Fz
# aGluZ3RvbjEQMA4GA1UEBxMHUmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENv
# cnBvcmF0aW9uMSUwIwYDVQQLExxNaWNyb3NvZnQgQW1lcmljYSBPcGVyYXRpb25z
# MScwJQYDVQQLEx5uU2hpZWxkIFRTUyBFU046QTUwMC0wNUUwLUQ5NDcxNTAzBgNV
# BAMTLE1pY3Jvc29mdCBQdWJsaWMgUlNBIFRpbWUgU3RhbXBpbmcgQXV0aG9yaXR5
# MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAtKWfm/ul027/d8Rlb8Mn
# /g0QUvvLqY2Vsy3tI8U2tFSspTZomZOD3BHT8LkR+RrhMJgb1VjAKFNysaK9cLSX
# ifPGSIBrPCgs9P4y24lrJEmrV6Q5z4BmqMhIPrZhEvZnWpCS4HO7jYSei/nxmC7/
# 1Er+l5Lg3PmSxb8d2IVcARxSw1B4mxB6XI0nkel9wa1dYb2wfGpofraFmxZOxT9e
# Nht4LH0RBSVueba6ZNpjS/0gtfm7qiIiyP6p6PRzTTbMnVqsHnV/d/rW0zHx+Q+Q
# NZ5wUqKmTZJB9hU853+2pX5rDfK32uNY9/WBOAmzbqgpEdQkbiMavUMyUDShmycI
# vgHdQnS207sTj8M+kJL3tOdahPuPqMwsaCCgdfwwQx0O9TKe7FSvbAEYs1AnldCl
# /KHGZCOVvUNqjyL10JLe0/+GD9/ynqXGWFpXOjaunvZ/cKROhjN4M5e6xx0b2miq
# cPii4/ii2ZheKallJET7CKlpFShs3wyg6F/fojQxQvPnbWD4Nyx6lhjWjwmoLcx6
# w1FSCtavLCly33BLRSlTU4qKUxaa8d7YN7Eqpn9XO0SY0umOvKFXrWH7rxl+9iai
# citdnTTksAnRjvekdKT3lg7lRMfmfZU8vXNiN0UYJzT9EjqjRm0uN/h0oXxPhNfP
# YqeFbyPXGGxzaYUz6zx3qTcCAwEAAaOCAcswggHHMB0GA1UdDgQWBBS+tjPyu6tZ
# /h5GsyLvyz1H+FNIWjAfBgNVHSMEGDAWgBRraSg6NS9IY0DPe9ivSek+2T3bITBs
# BgNVHR8EZTBjMGGgX6BdhltodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20vcGtpb3Bz
# L2NybC9NaWNyb3NvZnQlMjBQdWJsaWMlMjBSU0ElMjBUaW1lc3RhbXBpbmclMjBD
# QSUyMDIwMjAuY3JsMHkGCCsGAQUFBwEBBG0wazBpBggrBgEFBQcwAoZdaHR0cDov
# L3d3dy5taWNyb3NvZnQuY29tL3BraW9wcy9jZXJ0cy9NaWNyb3NvZnQlMjBQdWJs
# aWMlMjBSU0ElMjBUaW1lc3RhbXBpbmclMjBDQSUyMDIwMjAuY3J0MAwGA1UdEwEB
# /wQCMAAwFgYDVR0lAQH/BAwwCgYIKwYBBQUHAwgwDgYDVR0PAQH/BAQDAgeAMGYG
# A1UdIARfMF0wUQYMKwYBBAGCN0yDfQEBMEEwPwYIKwYBBQUHAgEWM2h0dHA6Ly93
# d3cubWljcm9zb2Z0LmNvbS9wa2lvcHMvRG9jcy9SZXBvc2l0b3J5Lmh0bTAIBgZn
# gQwBBAIwDQYJKoZIhvcNAQEMBQADggIBAA4DqAXEsO26j/La7Fgn/Qifit8xuZek
# qZ57+Ye+sH/hRTbEEjGYrZgsqwR/lUUfKCFpbZF8msaZPQJOR4YYUEU8XyjLrn8Y
# 1jCSmoxh9l7tWiSoc/JFBw356JAmzGGxeBA2EWSxRuTr1AuZe6nYaN8/wtFkiHcs
# 8gMadxXBs6DxVhyu5YnhLPQkfumKm3lFftwE7pieV7f1lskmlgsC6AeSGCzGPZUg
# CvcH5Tv/Qe9z7bIImSD3SuzhOIwaP+eKQTYf67TifyJKkWQSdGfTA6Kcu41k8LB6
# oPK+MLk1jbxxK5wPqLSL62xjK04SBXHEJSEnsFt0zxWkxP/lgej1DxqUnmrYEdkx
# vzKSHIAqFWSZul/5hI+vJxvFPhsNQBEk4cSulDkJQpcdVi/gmf/mHFOYhDBjsa15
# s4L+2sBil3XV/T8RiR66Q8xYvTLRWxd2dVsrOoCwnsU4WIeiC0JinCv1WLHEh7Qy
# zr9RSr4kKJLWdpNYLhgjkojTmEkAjFO774t3xB7enbvIF0GOsV19xnCUzq9EGKyt
# 0gMuaphKlNjJ+aTpjWMZDGo+GOKsnp93Hmftml0Syp3F9+M3y+y6WJGUZoIZJq22
# 7jDjjEndtpUrh9BdPdVIfVJD/Au81Rzh05UHAivorQ3Os8PELHIgiOd9TWzbdgmG
# zcILt/ddVQERMYIHRjCCB0ICAQEweDBhMQswCQYDVQQGEwJVUzEeMBwGA1UEChMV
# TWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUHVibGlj
# IFJTQSBUaW1lc3RhbXBpbmcgQ0EgMjAyMAITMwAAAFZ+j51YCI7pYAAAAAAAVjAN
# BglghkgBZQMEAgEFAKCCBJ8wEQYLKoZIhvcNAQkQAg8xAgUAMBoGCSqGSIb3DQEJ
# AzENBgsqhkiG9w0BCRABBDAcBgkqhkiG9w0BCQUxDxcNMjYwNTEwMTEzNjUzWjAv
# BgkqhkiG9w0BCQQxIgQgrvNKjzO8z1bF9ukGOElRV7aSbH1bgUre4htO6jEjPm8w
# gbkGCyqGSIb3DQEJEAIvMYGpMIGmMIGjMIGgBCC2DDMlTaTj8JV3iTg5Xnpe4CSH
# 60143Z+X9o5NBgMMqDB8MGWkYzBhMQswCQYDVQQGEwJVUzEeMBwGA1UEChMVTWlj
# cm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUHVibGljIFJT
# QSBUaW1lc3RhbXBpbmcgQ0EgMjAyMAITMwAAAFZ+j51YCI7pYAAAAAAAVjCCA2EG
# CyqGSIb3DQEJEAISMYIDUDCCA0yhggNIMIIDRDCCAiwCAQEwggEJoYHhpIHeMIHb
# MQswCQYDVQQGEwJVUzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMHUmVk
# bW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBvcmF0aW9uMSUwIwYDVQQLExxN
# aWNyb3NvZnQgQW1lcmljYSBPcGVyYXRpb25zMScwJQYDVQQLEx5uU2hpZWxkIFRT
# UyBFU046QTUwMC0wNUUwLUQ5NDcxNTAzBgNVBAMTLE1pY3Jvc29mdCBQdWJsaWMg
# UlNBIFRpbWUgU3RhbXBpbmcgQXV0aG9yaXR5oiMKAQEwBwYFKw4DAhoDFQD/c/cp
# FSqQWYBeXggyRJ2ZbvYEEaBnMGWkYzBhMQswCQYDVQQGEwJVUzEeMBwGA1UEChMV
# TWljcm9zb2Z0IENvcnBvcmF0aW9uMTIwMAYDVQQDEylNaWNyb3NvZnQgUHVibGlj
# IFJTQSBUaW1lc3RhbXBpbmcgQ0EgMjAyMDANBgkqhkiG9w0BAQsFAAIFAO2q6Ggw
# IhgPMjAyNjA1MTAxMTIwMDhaGA8yMDI2MDUxMTExMjAwOFowdzA9BgorBgEEAYRZ
# CgQBMS8wLTAKAgUA7aroaAIBADAKAgEAAgIJpQIB/zAHAgEAAgISPzAKAgUA7aw5
# 6AIBADA2BgorBgEEAYRZCgQCMSgwJjAMBgorBgEEAYRZCgMCoAowCAIBAAIDB6Eg
# oQowCAIBAAIDAYagMA0GCSqGSIb3DQEBCwUAA4IBAQCDcPfLiKR7zt+l/SyYwpC/
# tn1j1KQGC4uF/DiUuZBpODwChBlANCb8o6GPTSGhSbGmeY3gj//bDayBQxcvxP4N
# JLudWikfjLP8gotlmsRi9BlwP35lZvkgQNMHnJ4PDpHMFHtOw6AmhXkkdNKN8HDW
# TSEvdIAKirFOKZTllDtOmnGjfdhlgzdb07KRubZGradQnV8PoB/+RSq4/MVJ7Eo4
# fy32jFzJTy5E5v2lrlmcT28NoeWRSWmoXYmQZzcG/EbZXuu+m1/6Wfq+rHiJgZ0X
# OLp/BCy2M6UHGmpIGEmdgmAfBv3+BSHSSbbgX3q8hx7U2S5RiIccK+eEOkbzlTVU
# MA0GCSqGSIb3DQEBAQUABIICAIhXT3FFPXbaB+e23yDuRTFKcs8LnyfE7/pkneLd
# rCSqogmfH8R2Y3bIJgHbgfIa5o+TVLK00nRnZrJ2eI3YTxvFIYkC9EWK5U6QgVD0
# gkYDbUz5IDOzt18ZOn52TZmEWorehg/uVPXiT09pPR7z0tGDx5oVs98EvFyo7him
# c6EsI8I48lwUXhTYBoQwoyUY8Vpqbu9Xo2OJup2dTgcvCqJti+dxD5IbwCGYFt5e
# tVGYZ2gbMAgLN06UTWz64HXYRGCiuXkA2eILnoA5p2WM+m70LaexTUyz9FeJZGnC
# Nud2T5+8IweaAQblgRv3ytGF/AaS/W3UPHdvDXVcLxScV7ITZ9KNhmp7RxUUIP39
# fOlbQGQjq7b7gscmuVdaQvKL15CVaCsh3bEZyXVlyvvIIpXRXYMc50ltLnO+zwAG
# MtoIU2cmyfWw/YHmTI/wPWujs7VSMVe8mcPCqDzYJjY0JLSevvbHO3pmCZxUJh2V
# 9GNHHigb6dL6UzmZLp9S0+GUfqHv04EiSZxytcVhwAoDHhHNSBG5nynCwnn7fsah
# UEQQTfHqLJX6zeyOtC8LjFpjQ5bEhP6IcPBDZcr3IBVzoQ5fCbvmiWGZqzcCbr2U
# iuJgKmXiccgHKalrKvdc5CNQO4usE4w5JgtdezEvIlVRhYRd8V7jQkd+mFrMBPl0
# KYME
=======
# MIIvIwYJKoZIhvcNAQcCoIIvFDCCLxACAQExDzANBglghkgBZQMEAgEFADB5Bgor
# BgEEAYI3AgEEoGswaTA0BgorBgEEAYI3AgEeMCYCAwEAAAQQH8w7YFlLCE63JNLG
# KX7zUQIBAAIBAAIBAAIBAAIBADAxMA0GCWCGSAFlAwQCAQUABCBnL745ElCYk8vk
# dBtMuQhLeWJ3ZGfzKW4DHCYzAn+QB6CCE8MwggWQMIIDeKADAgECAhAFmxtXno4h
# MuI5B72nd3VcMA0GCSqGSIb3DQEBDAUAMGIxCzAJBgNVBAYTAlVTMRUwEwYDVQQK
# EwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5jb20xITAfBgNV
# BAMTGERpZ2lDZXJ0IFRydXN0ZWQgUm9vdCBHNDAeFw0xMzA4MDExMjAwMDBaFw0z
# ODAxMTUxMjAwMDBaMGIxCzAJBgNVBAYTAlVTMRUwEwYDVQQKEwxEaWdpQ2VydCBJ
# bmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5jb20xITAfBgNVBAMTGERpZ2lDZXJ0
# IFRydXN0ZWQgUm9vdCBHNDCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIB
# AL/mkHNo3rvkXUo8MCIwaTPswqclLskhPfKK2FnC4SmnPVirdprNrnsbhA3EMB/z
# G6Q4FutWxpdtHauyefLKEdLkX9YFPFIPUh/GnhWlfr6fqVcWWVVyr2iTcMKyunWZ
# anMylNEQRBAu34LzB4TmdDttceItDBvuINXJIB1jKS3O7F5OyJP4IWGbNOsFxl7s
# Wxq868nPzaw0QF+xembud8hIqGZXV59UWI4MK7dPpzDZVu7Ke13jrclPXuU15zHL
# 2pNe3I6PgNq2kZhAkHnDeMe2scS1ahg4AxCN2NQ3pC4FfYj1gj4QkXCrVYJBMtfb
# BHMqbpEBfCFM1LyuGwN1XXhm2ToxRJozQL8I11pJpMLmqaBn3aQnvKFPObURWBf3
# JFxGj2T3wWmIdph2PVldQnaHiZdpekjw4KISG2aadMreSx7nDmOu5tTvkpI6nj3c
# AORFJYm2mkQZK37AlLTSYW3rM9nF30sEAMx9HJXDj/chsrIRt7t/8tWMcCxBYKqx
# YxhElRp2Yn72gLD76GSmM9GJB+G9t+ZDpBi4pncB4Q+UDCEdslQpJYls5Q5SUUd0
# viastkF13nqsX40/ybzTQRESW+UQUOsxxcpyFiIJ33xMdT9j7CFfxCBRa2+xq4aL
# T8LWRV+dIPyhHsXAj6KxfgommfXkaS+YHS312amyHeUbAgMBAAGjQjBAMA8GA1Ud
# EwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgGGMB0GA1UdDgQWBBTs1+OC0nFdZEzf
# Lmc/57qYrhwPTzANBgkqhkiG9w0BAQwFAAOCAgEAu2HZfalsvhfEkRvDoaIAjeNk
# aA9Wz3eucPn9mkqZucl4XAwMX+TmFClWCzZJXURj4K2clhhmGyMNPXnpbWvWVPjS
# PMFDQK4dUPVS/JA7u5iZaWvHwaeoaKQn3J35J64whbn2Z006Po9ZOSJTROvIXQPK
# 7VB6fWIhCoDIc2bRoAVgX+iltKevqPdtNZx8WorWojiZ83iL9E3SIAveBO6Mm0eB
# cg3AFDLvMFkuruBx8lbkapdvklBtlo1oepqyNhR6BvIkuQkRUNcIsbiJeoQjYUIp
# 5aPNoiBB19GcZNnqJqGLFNdMGbJQQXE9P01wI4YMStyB0swylIQNCAmXHE/A7msg
# dDDS4Dk0EIUhFQEI6FUy3nFJ2SgXUE3mvk3RdazQyvtBuEOlqtPDBURPLDab4vri
# RbgjU2wGb2dVf0a1TD9uKFp5JtKkqGKX0h7i7UqLvBv9R0oN32dmfrJbQdA75PQ7
# 9ARj6e/CVABRoIoqyc54zNXqhwQYs86vSYiv85KZtrPmYQ/ShQDnUBrkG5WdGaG5
# nLGbsQAe79APT0JsyQq87kP6OnGlyE0mpTX9iV28hWIdMtKgK1TtmlfB2/oQzxm3
# i0objwG2J5VT6LaJbVu8aNQj6ItRolb58KaAoNYes7wPD1N1KarqE3fk3oyBIa0H
# EEcRrYc9B9F1vM/zZn4wggawMIIEmKADAgECAhAIrUCyYNKcTJ9ezam9k67ZMA0G
# CSqGSIb3DQEBDAUAMGIxCzAJBgNVBAYTAlVTMRUwEwYDVQQKEwxEaWdpQ2VydCBJ
# bmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5jb20xITAfBgNVBAMTGERpZ2lDZXJ0
# IFRydXN0ZWQgUm9vdCBHNDAeFw0yMTA0MjkwMDAwMDBaFw0zNjA0MjgyMzU5NTla
# MGkxCzAJBgNVBAYTAlVTMRcwFQYDVQQKEw5EaWdpQ2VydCwgSW5jLjFBMD8GA1UE
# AxM4RGlnaUNlcnQgVHJ1c3RlZCBHNCBDb2RlIFNpZ25pbmcgUlNBNDA5NiBTSEEz
# ODQgMjAyMSBDQTEwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQDVtC9C
# 0CiteLdd1TlZG7GIQvUzjOs9gZdwxbvEhSYwn6SOaNhc9es0JAfhS0/TeEP0F9ce
# 2vnS1WcaUk8OoVf8iJnBkcyBAz5NcCRks43iCH00fUyAVxJrQ5qZ8sU7H/Lvy0da
# E6ZMswEgJfMQ04uy+wjwiuCdCcBlp/qYgEk1hz1RGeiQIXhFLqGfLOEYwhrMxe6T
# SXBCMo/7xuoc82VokaJNTIIRSFJo3hC9FFdd6BgTZcV/sk+FLEikVoQ11vkunKoA
# FdE3/hoGlMJ8yOobMubKwvSnowMOdKWvObarYBLj6Na59zHh3K3kGKDYwSNHR7Oh
# D26jq22YBoMbt2pnLdK9RBqSEIGPsDsJ18ebMlrC/2pgVItJwZPt4bRc4G/rJvmM
# 1bL5OBDm6s6R9b7T+2+TYTRcvJNFKIM2KmYoX7BzzosmJQayg9Rc9hUZTO1i4F4z
# 8ujo7AqnsAMrkbI2eb73rQgedaZlzLvjSFDzd5Ea/ttQokbIYViY9XwCFjyDKK05
# huzUtw1T0PhH5nUwjewwk3YUpltLXXRhTT8SkXbev1jLchApQfDVxW0mdmgRQRNY
# mtwmKwH0iU1Z23jPgUo+QEdfyYFQc4UQIyFZYIpkVMHMIRroOBl8ZhzNeDhFMJlP
# /2NPTLuqDQhTQXxYPUez+rbsjDIJAsxsPAxWEQIDAQABo4IBWTCCAVUwEgYDVR0T
# AQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQUaDfg67Y7+F8Rhvv+YXsIiGX0TkIwHwYD
# VR0jBBgwFoAU7NfjgtJxXWRM3y5nP+e6mK4cD08wDgYDVR0PAQH/BAQDAgGGMBMG
# A1UdJQQMMAoGCCsGAQUFBwMDMHcGCCsGAQUFBwEBBGswaTAkBggrBgEFBQcwAYYY
# aHR0cDovL29jc3AuZGlnaWNlcnQuY29tMEEGCCsGAQUFBzAChjVodHRwOi8vY2Fj
# ZXJ0cy5kaWdpY2VydC5jb20vRGlnaUNlcnRUcnVzdGVkUm9vdEc0LmNydDBDBgNV
# HR8EPDA6MDigNqA0hjJodHRwOi8vY3JsMy5kaWdpY2VydC5jb20vRGlnaUNlcnRU
# cnVzdGVkUm9vdEc0LmNybDAcBgNVHSAEFTATMAcGBWeBDAEDMAgGBmeBDAEEATAN
# BgkqhkiG9w0BAQwFAAOCAgEAOiNEPY0Idu6PvDqZ01bgAhql+Eg08yy25nRm95Ry
# sQDKr2wwJxMSnpBEn0v9nqN8JtU3vDpdSG2V1T9J9Ce7FoFFUP2cvbaF4HZ+N3HL
# IvdaqpDP9ZNq4+sg0dVQeYiaiorBtr2hSBh+3NiAGhEZGM1hmYFW9snjdufE5Btf
# Q/g+lP92OT2e1JnPSt0o618moZVYSNUa/tcnP/2Q0XaG3RywYFzzDaju4ImhvTnh
# OE7abrs2nfvlIVNaw8rpavGiPttDuDPITzgUkpn13c5UbdldAhQfQDN8A+KVssIh
# dXNSy0bYxDQcoqVLjc1vdjcshT8azibpGL6QB7BDf5WIIIJw8MzK7/0pNVwfiThV
# 9zeKiwmhywvpMRr/LhlcOXHhvpynCgbWJme3kuZOX956rEnPLqR0kq3bPKSchh/j
# wVYbKyP/j7XqiHtwa+aguv06P0WmxOgWkVKLQcBIhEuWTatEQOON8BUozu3xGFYH
# Ki8QxAwIZDwzj64ojDzLj4gLDb879M4ee47vtevLt/B3E+bnKD+sEq6lLyJsQfmC
# XBVmzGwOysWGw/YmMwwHS6DTBwJqakAwSEs0qFEgu60bhQjiWQ1tygVQK+pKHJ6l
# /aCnHwZ05/LWUpD9r4VIIflXO7ScA+2GRfS0YW6/aOImYIbqyK+p/pQd52MbOoZW
# eE4wggd3MIIFX6ADAgECAhAHHxQbizANJfMU6yMM0NHdMA0GCSqGSIb3DQEBCwUA
# MGkxCzAJBgNVBAYTAlVTMRcwFQYDVQQKEw5EaWdpQ2VydCwgSW5jLjFBMD8GA1UE
# AxM4RGlnaUNlcnQgVHJ1c3RlZCBHNCBDb2RlIFNpZ25pbmcgUlNBNDA5NiBTSEEz
# ODQgMjAyMSBDQTEwHhcNMjIwMTE3MDAwMDAwWhcNMjUwMTE1MjM1OTU5WjB8MQsw
# CQYDVQQGEwJVUzEPMA0GA1UECBMGT3JlZ29uMRIwEAYDVQQHEwlCZWF2ZXJ0b24x
# IzAhBgNVBAoTGlB5dGhvbiBTb2Z0d2FyZSBGb3VuZGF0aW9uMSMwIQYDVQQDExpQ
# eXRob24gU29mdHdhcmUgRm91bmRhdGlvbjCCAiIwDQYJKoZIhvcNAQEBBQADggIP
# ADCCAgoCggIBAKgc0BTT+iKbtK6f2mr9pNMUTcAJxKdsuOiSYgDFfwhjQy89koM7
# uP+QV/gwx8MzEt3c9tLJvDccVWQ8H7mVsk/K+X+IufBLCgUi0GGAZUegEAeRlSXx
# xhYScr818ma8EvGIZdiSOhqjYc4KnfgfIS4RLtZSrDFG2tN16yS8skFa3IHyvWdb
# D9PvZ4iYNAS4pjYDRjT/9uzPZ4Pan+53xZIcDgjiTwOh8VGuppxcia6a7xCyKoOA
# GjvCyQsj5223v1/Ig7Dp9mGI+nh1E3IwmyTIIuVHyK6Lqu352diDY+iCMpk9Zanm
# SjmB+GMVs+H/gOiofjjtf6oz0ki3rb7sQ8fTnonIL9dyGTJ0ZFYKeb6BLA66d2GA
# LwxZhLe5WH4Np9HcyXHACkppsE6ynYjTOd7+jN1PRJahN1oERzTzEiV6nCO1M3U1
# HbPTGyq52IMFSBM2/07WTJSbOeXjvYR7aUxK9/ZkJiacl2iZI7IWe7JKhHohqKuc
# eQNyOzxTakLcRkzynvIrk33R9YVqtB4L6wtFxhUjvDnQg16xot2KVPdfyPAWd81w
# tZADmrUtsZ9qG79x1hBdyOl4vUtVPECuyhCxaw+faVjumapPUnwo8ygflJJ74J+B
# Yxf6UuD7m8yzsfXWkdv52DjL74TxzuFTLHPyARWCSCAbzn3ZIly+qIqDAgMBAAGj
# ggIGMIICAjAfBgNVHSMEGDAWgBRoN+Drtjv4XxGG+/5hewiIZfROQjAdBgNVHQ4E
# FgQUt/1Teh2XDuUj2WW3siYWJgkZHA8wDgYDVR0PAQH/BAQDAgeAMBMGA1UdJQQM
# MAoGCCsGAQUFBwMDMIG1BgNVHR8Ega0wgaowU6BRoE+GTWh0dHA6Ly9jcmwzLmRp
# Z2ljZXJ0LmNvbS9EaWdpQ2VydFRydXN0ZWRHNENvZGVTaWduaW5nUlNBNDA5NlNI
# QTM4NDIwMjFDQTEuY3JsMFOgUaBPhk1odHRwOi8vY3JsNC5kaWdpY2VydC5jb20v
# RGlnaUNlcnRUcnVzdGVkRzRDb2RlU2lnbmluZ1JTQTQwOTZTSEEzODQyMDIxQ0Ex
# LmNybDA+BgNVHSAENzA1MDMGBmeBDAEEATApMCcGCCsGAQUFBwIBFhtodHRwOi8v
# d3d3LmRpZ2ljZXJ0LmNvbS9DUFMwgZQGCCsGAQUFBwEBBIGHMIGEMCQGCCsGAQUF
# BzABhhhodHRwOi8vb2NzcC5kaWdpY2VydC5jb20wXAYIKwYBBQUHMAKGUGh0dHA6
# Ly9jYWNlcnRzLmRpZ2ljZXJ0LmNvbS9EaWdpQ2VydFRydXN0ZWRHNENvZGVTaWdu
# aW5nUlNBNDA5NlNIQTM4NDIwMjFDQTEuY3J0MAwGA1UdEwEB/wQCMAAwDQYJKoZI
# hvcNAQELBQADggIBABxv4AeV/5ltkELHSC63fXAFYS5tadcWTiNc2rskrNLrfH1N
# s0vgSZFoQxYBFKI159E8oQQ1SKbTEubZ/B9kmHPhprHya08+VVzxC88pOEvz68nA
# 82oEM09584aILqYmj8Pj7h/kmZNzuEL7WiwFa/U1hX+XiWfLIJQsAHBla0i7QRF2
# de8/VSF0XXFa2kBQ6aiTsiLyKPNbaNtbcucaUdn6vVUS5izWOXM95BSkFSKdE45O
# q3FForNJXjBvSCpwcP36WklaHL+aHu1upIhCTUkzTHMh8b86WmjRUqbrnvdyR2yd
# I5l1OqcMBjkpPpIV6wcc+KY/RH2xvVuuoHjlUjwq2bHiNoX+W1scCpnA8YTs2d50
# jDHUgwUo+ciwpffH0Riq132NFmrH3r67VaN3TuBxjI8SIZM58WEDkbeoriDk3hxU
# 8ZWV7b8AW6oyVBGfM06UgkfMb58h+tJPrFx8VI/WLq1dTqMfZOm5cuclMnUHs2uq
# rRNtnV8UfidPBL4ZHkTcClQbCoz0UbLhkiDvIS00Dn+BBcxw/TKqVL4Oaz3bkMSs
# M46LciTeucHY9ExRVt3zy7i149sd+F4QozPqn7FrSVHXmem3r7bjyHTxOgqxRCVa
# 18Vtx7P/8bYSBeS+WHCKcliFCecspusCDSlnRUjZwyPdP0VHxaZg2unjHY3rMYIa
# tjCCGrICAQEwfTBpMQswCQYDVQQGEwJVUzEXMBUGA1UEChMORGlnaUNlcnQsIElu
# Yy4xQTA/BgNVBAMTOERpZ2lDZXJ0IFRydXN0ZWQgRzQgQ29kZSBTaWduaW5nIFJT
# QTQwOTYgU0hBMzg0IDIwMjEgQ0ExAhAHHxQbizANJfMU6yMM0NHdMA0GCWCGSAFl
# AwQCAQUAoIHIMBkGCSqGSIb3DQEJAzEMBgorBgEEAYI3AgEEMBwGCisGAQQBgjcC
# AQsxDjAMBgorBgEEAYI3AgEVMC8GCSqGSIb3DQEJBDEiBCBnAZ6P7YvTwq0fbF62
# o7E75R0LxsW5OtyYiFESQckLhjBcBgorBgEEAYI3AgEMMU4wTKBGgEQAQgB1AGkA
# bAB0ADoAIABSAGUAbABlAGEAcwBlAF8AdgAzAC4AMQAxAC4AOQBfADIAMAAyADQA
# MAA0ADAAMgAuADAAMqECgAAwDQYJKoZIhvcNAQEBBQAEggIAg5wQO5NiKFirm9vr
# 1//X5G4t+z318Uagu8vJT/vTjkMTau86CF+SwP3pqC1H2ZMUyVYmVHae5dswKAMR
# hHY1VJV/0lJI+LdYcaxHI/WYzaFLbDrQI/Mty5cabjveG6geMlcJG4nYZlyQX+fJ
# 1k0ogeIF1owldecXP8t5e10WlHBlWb8IBnIPwMtJVZ2/y8NASxsnSJE7pEe7ijGe
# 5Bv9DXvoltKnMSVYv9u2vn7PeIq+Jm3n3kOGSIYtfdytEd1Fd6spfdcmIhqyzVk0
# Hslq7Aqd7soT0xdmNa/amzEA4HRHpWGUhzOtcC+EqEIIJk9kTjyVgCiyWaB5gGko
# OAZfsxQn+a916iWwA7RrQ+TzBZq/pleUTLZzJmI3DXFjuJ1NDP6Sdw6KREgx6Yw4
# q2NnnodKlGZkMDcGYPTM2sA4i6i6FsznWY4d8wE4J261YeUrVfIyTx+Q81W4KXoi
# C0x7Pe9Bjh4oJGM3YiLyhVL56sXZWxAC2C/vD3nvIvra9EpvlMvQh6b0xl0V4TSN
# dJ7T7VttR/WNjau46JIgbGZWCDBTTUAydQNoAZ4KnCrcIZCN6Y0qVokXsYHsVIto
# TsnM2+Ca09wxuOIfCOSKpAmqdJ/w2NwLwp+0gwrO2uzpCfbSbkAd+UQNv0joPyUp
# ywmsQndxqA8TaADp8TfkkpJywJGhghc/MIIXOwYKKwYBBAGCNwMDATGCFyswghcn
# BgkqhkiG9w0BBwKgghcYMIIXFAIBAzEPMA0GCWCGSAFlAwQCAQUAMHcGCyqGSIb3
# DQEJEAEEoGgEZjBkAgEBBglghkgBhv1sBwEwMTANBglghkgBZQMEAgEFAAQg+Jhe
# IOzOttA8vliuL+r3CiY4EJTzfvPasXkI/vwkoI8CEHZ95Ht1TmSmU8+fM0kIG00Y
# DzIwMjQwNDAyMTIzMjEwWqCCEwkwggbCMIIEqqADAgECAhAFRK/zlJ0IOaa/2z9f
# 5WEWMA0GCSqGSIb3DQEBCwUAMGMxCzAJBgNVBAYTAlVTMRcwFQYDVQQKEw5EaWdp
# Q2VydCwgSW5jLjE7MDkGA1UEAxMyRGlnaUNlcnQgVHJ1c3RlZCBHNCBSU0E0MDk2
# IFNIQTI1NiBUaW1lU3RhbXBpbmcgQ0EwHhcNMjMwNzE0MDAwMDAwWhcNMzQxMDEz
# MjM1OTU5WjBIMQswCQYDVQQGEwJVUzEXMBUGA1UEChMORGlnaUNlcnQsIEluYy4x
# IDAeBgNVBAMTF0RpZ2lDZXJ0IFRpbWVzdGFtcCAyMDIzMIICIjANBgkqhkiG9w0B
# AQEFAAOCAg8AMIICCgKCAgEAo1NFhx2DjlusPlSzI+DPn9fl0uddoQ4J3C9Io5d6
# OyqcZ9xiFVjBqZMRp82qsmrdECmKHmJjadNYnDVxvzqX65RQjxwg6seaOy+WZuNp
# 52n+W8PWKyAcwZeUtKVQgfLPywemMGjKg0La/H8JJJSkghraarrYO8pd3hkYhftF
# 6g1hbJ3+cV7EBpo88MUueQ8bZlLjyNY+X9pD04T10Mf2SC1eRXWWdf7dEKEbg8G4
# 5lKVtUfXeCk5a+B4WZfjRCtK1ZXO7wgX6oJkTf8j48qG7rSkIWRw69XloNpjsy7p
# Be6q9iT1HbybHLK3X9/w7nZ9MZllR1WdSiQvrCuXvp/k/XtzPjLuUjT71Lvr1KAs
# NJvj3m5kGQc3AZEPHLVRzapMZoOIaGK7vEEbeBlt5NkP4FhB+9ixLOFRr7StFQYU
# 6mIIE9NpHnxkTZ0P387RXoyqq1AVybPKvNfEO2hEo6U7Qv1zfe7dCv95NBB+plwK
# WEwAPoVpdceDZNZ1zY8SdlalJPrXxGshuugfNJgvOuprAbD3+yqG7HtSOKmYCaFx
# smxxrz64b5bV4RAT/mFHCoz+8LbH1cfebCTwv0KCyqBxPZySkwS0aXAnDU+3tTbR
# yV8IpHCj7ArxES5k4MsiK8rxKBMhSVF+BmbTO77665E42FEHypS34lCh8zrTioPL
# QHsCAwEAAaOCAYswggGHMA4GA1UdDwEB/wQEAwIHgDAMBgNVHRMBAf8EAjAAMBYG
# A1UdJQEB/wQMMAoGCCsGAQUFBwMIMCAGA1UdIAQZMBcwCAYGZ4EMAQQCMAsGCWCG
# SAGG/WwHATAfBgNVHSMEGDAWgBS6FtltTYUvcyl2mi91jGogj57IbzAdBgNVHQ4E
# FgQUpbbvE+fvzdBkodVWqWUxo97V40kwWgYDVR0fBFMwUTBPoE2gS4ZJaHR0cDov
# L2NybDMuZGlnaWNlcnQuY29tL0RpZ2lDZXJ0VHJ1c3RlZEc0UlNBNDA5NlNIQTI1
# NlRpbWVTdGFtcGluZ0NBLmNybDCBkAYIKwYBBQUHAQEEgYMwgYAwJAYIKwYBBQUH
# MAGGGGh0dHA6Ly9vY3NwLmRpZ2ljZXJ0LmNvbTBYBggrBgEFBQcwAoZMaHR0cDov
# L2NhY2VydHMuZGlnaWNlcnQuY29tL0RpZ2lDZXJ0VHJ1c3RlZEc0UlNBNDA5NlNI
# QTI1NlRpbWVTdGFtcGluZ0NBLmNydDANBgkqhkiG9w0BAQsFAAOCAgEAgRrW3qCp
# tZgXvHCNT4o8aJzYJf/LLOTN6l0ikuyMIgKpuM+AqNnn48XtJoKKcS8Y3U623mzX
# 4WCcK+3tPUiOuGu6fF29wmE3aEl3o+uQqhLXJ4Xzjh6S2sJAOJ9dyKAuJXglnSoF
# eoQpmLZXeY/bJlYrsPOnvTcM2Jh2T1a5UsK2nTipgedtQVyMadG5K8TGe8+c+nji
# kxp2oml101DkRBK+IA2eqUTQ+OVJdwhaIcW0z5iVGlS6ubzBaRm6zxbygzc0brBB
# Jt3eWpdPM43UjXd9dUWhpVgmagNF3tlQtVCMr1a9TMXhRsUo063nQwBw3syYnhmJ
# A+rUkTfvTVLzyWAhxFZH7doRS4wyw4jmWOK22z75X7BC1o/jF5HRqsBV44a/rCcs
# QdCaM0qoNtS5cpZ+l3k4SF/Kwtw9Mt911jZnWon49qfH5U81PAC9vpwqbHkB3NpE
# 5jreODsHXjlY9HxzMVWggBHLFAx+rrz+pOt5Zapo1iLKO+uagjVXKBbLafIymrLS
# 2Dq4sUaGa7oX/cR3bBVsrquvczroSUa31X/MtjjA2Owc9bahuEMs305MfR5ocMB3
# CtQC4Fxguyj/OOVSWtasFyIjTvTs0xf7UGv/B3cfcZdEQcm4RtNsMnxYL2dHZeUb
# c7aZ+WssBkbvQR7w8F/g29mtkIBEr4AQQYowggauMIIElqADAgECAhAHNje3JFR8
# 2Ees/ShmKl5bMA0GCSqGSIb3DQEBCwUAMGIxCzAJBgNVBAYTAlVTMRUwEwYDVQQK
# EwxEaWdpQ2VydCBJbmMxGTAXBgNVBAsTEHd3dy5kaWdpY2VydC5jb20xITAfBgNV
# BAMTGERpZ2lDZXJ0IFRydXN0ZWQgUm9vdCBHNDAeFw0yMjAzMjMwMDAwMDBaFw0z
# NzAzMjIyMzU5NTlaMGMxCzAJBgNVBAYTAlVTMRcwFQYDVQQKEw5EaWdpQ2VydCwg
# SW5jLjE7MDkGA1UEAxMyRGlnaUNlcnQgVHJ1c3RlZCBHNCBSU0E0MDk2IFNIQTI1
# NiBUaW1lU3RhbXBpbmcgQ0EwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoIC
# AQDGhjUGSbPBPXJJUVXHJQPE8pE3qZdRodbSg9GeTKJtoLDMg/la9hGhRBVCX6SI
# 82j6ffOciQt/nR+eDzMfUBMLJnOWbfhXqAJ9/UO0hNoR8XOxs+4rgISKIhjf69o9
# xBd/qxkrPkLcZ47qUT3w1lbU5ygt69OxtXXnHwZljZQp09nsad/ZkIdGAHvbREGJ
# 3HxqV3rwN3mfXazL6IRktFLydkf3YYMZ3V+0VAshaG43IbtArF+y3kp9zvU5Emfv
# DqVjbOSmxR3NNg1c1eYbqMFkdECnwHLFuk4fsbVYTXn+149zk6wsOeKlSNbwsDET
# qVcplicu9Yemj052FVUmcJgmf6AaRyBD40NjgHt1biclkJg6OBGz9vae5jtb7IHe
# IhTZgirHkr+g3uM+onP65x9abJTyUpURK1h0QCirc0PO30qhHGs4xSnzyqqWc0Jo
# n7ZGs506o9UD4L/wojzKQtwYSH8UNM/STKvvmz3+DrhkKvp1KCRB7UK/BZxmSVJQ
# 9FHzNklNiyDSLFc1eSuo80VgvCONWPfcYd6T/jnA+bIwpUzX6ZhKWD7TA4j+s4/T
# Xkt2ElGTyYwMO1uKIqjBJgj5FBASA31fI7tk42PgpuE+9sJ0sj8eCXbsq11GdeJg
# o1gJASgADoRU7s7pXcheMBK9Rp6103a50g5rmQzSM7TNsQIDAQABo4IBXTCCAVkw
# EgYDVR0TAQH/BAgwBgEB/wIBADAdBgNVHQ4EFgQUuhbZbU2FL3MpdpovdYxqII+e
# yG8wHwYDVR0jBBgwFoAU7NfjgtJxXWRM3y5nP+e6mK4cD08wDgYDVR0PAQH/BAQD
# AgGGMBMGA1UdJQQMMAoGCCsGAQUFBwMIMHcGCCsGAQUFBwEBBGswaTAkBggrBgEF
# BQcwAYYYaHR0cDovL29jc3AuZGlnaWNlcnQuY29tMEEGCCsGAQUFBzAChjVodHRw
# Oi8vY2FjZXJ0cy5kaWdpY2VydC5jb20vRGlnaUNlcnRUcnVzdGVkUm9vdEc0LmNy
# dDBDBgNVHR8EPDA6MDigNqA0hjJodHRwOi8vY3JsMy5kaWdpY2VydC5jb20vRGln
# aUNlcnRUcnVzdGVkUm9vdEc0LmNybDAgBgNVHSAEGTAXMAgGBmeBDAEEAjALBglg
# hkgBhv1sBwEwDQYJKoZIhvcNAQELBQADggIBAH1ZjsCTtm+YqUQiAX5m1tghQuGw
# GC4QTRPPMFPOvxj7x1Bd4ksp+3CKDaopafxpwc8dB+k+YMjYC+VcW9dth/qEICU0
# MWfNthKWb8RQTGIdDAiCqBa9qVbPFXONASIlzpVpP0d3+3J0FNf/q0+KLHqrhc1D
# X+1gtqpPkWaeLJ7giqzl/Yy8ZCaHbJK9nXzQcAp876i8dU+6WvepELJd6f8oVInw
# 1YpxdmXazPByoyP6wCeCRK6ZJxurJB4mwbfeKuv2nrF5mYGjVoarCkXJ38SNoOeY
# +/umnXKvxMfBwWpx2cYTgAnEtp/Nh4cku0+jSbl3ZpHxcpzpSwJSpzd+k1OsOx0I
# SQ+UzTl63f8lY5knLD0/a6fxZsNBzU+2QJshIUDQtxMkzdwdeDrknq3lNHGS1yZr
# 5Dhzq6YBT70/O3itTK37xJV77QpfMzmHQXh6OOmc4d0j/R0o08f56PGYX/sr2H7y
# Rp11LB4nLCbbbxV7HhmLNriT1ObyF5lZynDwN7+YAN8gFk8n+2BnFqFmut1VwDop
# hrCYoCvtlUG3OtUVmDG0YgkPCr2B2RP+v6TR81fZvAT6gt4y3wSJ8ADNXcL50CN/
# AAvkdgIm2fBldkKmKYcJRyvmfxqkhQ/8mJb2VVQrH4D6wPIOK+XW+6kvRBVK5xMO
# Hds3OBqhK/bt1nz8MIIFjTCCBHWgAwIBAgIQDpsYjvnQLefv21DiCEAYWjANBgkq
# hkiG9w0BAQwFADBlMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5j
# MRkwFwYDVQQLExB3d3cuZGlnaWNlcnQuY29tMSQwIgYDVQQDExtEaWdpQ2VydCBB
# c3N1cmVkIElEIFJvb3QgQ0EwHhcNMjIwODAxMDAwMDAwWhcNMzExMTA5MjM1OTU5
# WjBiMQswCQYDVQQGEwJVUzEVMBMGA1UEChMMRGlnaUNlcnQgSW5jMRkwFwYDVQQL
# ExB3d3cuZGlnaWNlcnQuY29tMSEwHwYDVQQDExhEaWdpQ2VydCBUcnVzdGVkIFJv
# b3QgRzQwggIiMA0GCSqGSIb3DQEBAQUAA4ICDwAwggIKAoICAQC/5pBzaN675F1K
# PDAiMGkz7MKnJS7JIT3yithZwuEppz1Yq3aaza57G4QNxDAf8xukOBbrVsaXbR2r
# snnyyhHS5F/WBTxSD1Ifxp4VpX6+n6lXFllVcq9ok3DCsrp1mWpzMpTREEQQLt+C
# 8weE5nQ7bXHiLQwb7iDVySAdYyktzuxeTsiT+CFhmzTrBcZe7FsavOvJz82sNEBf
# sXpm7nfISKhmV1efVFiODCu3T6cw2Vbuyntd463JT17lNecxy9qTXtyOj4DatpGY
# QJB5w3jHtrHEtWoYOAMQjdjUN6QuBX2I9YI+EJFwq1WCQTLX2wRzKm6RAXwhTNS8
# rhsDdV14Ztk6MUSaM0C/CNdaSaTC5qmgZ92kJ7yhTzm1EVgX9yRcRo9k98FpiHaY
# dj1ZXUJ2h4mXaXpI8OCiEhtmmnTK3kse5w5jrubU75KSOp493ADkRSWJtppEGSt+
# wJS00mFt6zPZxd9LBADMfRyVw4/3IbKyEbe7f/LVjHAsQWCqsWMYRJUadmJ+9oCw
# ++hkpjPRiQfhvbfmQ6QYuKZ3AeEPlAwhHbJUKSWJbOUOUlFHdL4mrLZBdd56rF+N
# P8m800ERElvlEFDrMcXKchYiCd98THU/Y+whX8QgUWtvsauGi0/C1kVfnSD8oR7F
# wI+isX4KJpn15GkvmB0t9dmpsh3lGwIDAQABo4IBOjCCATYwDwYDVR0TAQH/BAUw
# AwEB/zAdBgNVHQ4EFgQU7NfjgtJxXWRM3y5nP+e6mK4cD08wHwYDVR0jBBgwFoAU
# Reuir/SSy4IxLVGLp6chnfNtyA8wDgYDVR0PAQH/BAQDAgGGMHkGCCsGAQUFBwEB
# BG0wazAkBggrBgEFBQcwAYYYaHR0cDovL29jc3AuZGlnaWNlcnQuY29tMEMGCCsG
# AQUFBzAChjdodHRwOi8vY2FjZXJ0cy5kaWdpY2VydC5jb20vRGlnaUNlcnRBc3N1
# cmVkSURSb290Q0EuY3J0MEUGA1UdHwQ+MDwwOqA4oDaGNGh0dHA6Ly9jcmwzLmRp
# Z2ljZXJ0LmNvbS9EaWdpQ2VydEFzc3VyZWRJRFJvb3RDQS5jcmwwEQYDVR0gBAow
# CDAGBgRVHSAAMA0GCSqGSIb3DQEBDAUAA4IBAQBwoL9DXFXnOF+go3QbPbYW1/e/
# Vwe9mqyhhyzshV6pGrsi+IcaaVQi7aSId229GhT0E0p6Ly23OO/0/4C5+KH38nLe
# JLxSA8hO0Cre+i1Wz/n096wwepqLsl7Uz9FDRJtDIeuWcqFItJnLnU+nBgMTdydE
# 1Od/6Fmo8L8vC6bp8jQ87PcDx4eo0kxAGTVGamlUsLihVo7spNU96LHc/RzY9Hda
# XFSMb++hUD38dglohJ9vytsgjTVgHAIDyyCwrFigDkBjxZgiwbJZ9VVrzyerbHbO
# byMt9H5xaiNrIv8SuFQtJ37YOtnwtoeW/VvRXKwYw02fc7cBqZ9Xql4o4rmUMYID
# djCCA3ICAQEwdzBjMQswCQYDVQQGEwJVUzEXMBUGA1UEChMORGlnaUNlcnQsIElu
# Yy4xOzA5BgNVBAMTMkRpZ2lDZXJ0IFRydXN0ZWQgRzQgUlNBNDA5NiBTSEEyNTYg
# VGltZVN0YW1waW5nIENBAhAFRK/zlJ0IOaa/2z9f5WEWMA0GCWCGSAFlAwQCAQUA
# oIHRMBoGCSqGSIb3DQEJAzENBgsqhkiG9w0BCRABBDAcBgkqhkiG9w0BCQUxDxcN
# MjQwNDAyMTIzMjEwWjArBgsqhkiG9w0BCRACDDEcMBowGDAWBBRm8CsywsLJD4Jd
# zqqKycZPGZzPQDAvBgkqhkiG9w0BCQQxIgQg58bvIvjFkyBb2O0xwLgtU8RJLcMV
# kvIdXiq3TCLuhq4wNwYLKoZIhvcNAQkQAi8xKDAmMCQwIgQg0vbkbe10IszR1EBX
# aEE2b4KK2lWarjMWr00amtQMeCgwDQYJKoZIhvcNAQEBBQAEggIAhU3imuIvql4+
# IqPz0Anf0ZIB5hbafNTx1WEVhPEG9iJr24gpjbWvepQrbWJf0FBj8wY9GeRab6iv
# 79MMxZkPpR/DMK1qFr1vIlw67JhpqqNkaNIa5G3pAHDYdHYcB+Utw1p5XPOBRu0A
# f4wQ5fwWugys4CGGAboq4prLNRKeUGVexMDK7Eorsv9xmzK0tE9QSMA3SxLCcSIX
# mrMkKzTR3vn0dqaDG4Ge7U2w7dVnQYGBX+s6C9CCjvCtenCAQLbF+OyYhkMNDVtJ
# lTmzxxwyyA5fFZJpG/Wfo/84/P8lQXUTuwOBpFoLE65OqNEG03SoqKsW4aTqkVM7
# b6fKLsygm1w23+UlHGF/fbExeqxgOZiuJWWt/OFy9T3HIcAF1SMh7mot5ciu7btS
# xjkr/fhsi1M3M1g/giyn0I8N24mgaICPtXAzAbZW7GSC0R5T2qnW6gYoAcY62Qdz
# jl/Ey1rnOQ26TuQODyPVHhfhoIBbdIDpDJ2Vu2mxyxUnjATbizphcBgsU1fBYvZR
# v+SuK1MYZOGqgzugfiufdeFAlBDA/e64yRkJvDBEkcyGvj6FS6nVm7ekJpJhLU3z
# sSSmcYwdx1YQCr48HEjcmGrj5sAzzg4U4WU/GrLWz2sSRmh5rKcDAa0ewfYi13Z2
# a/cdr8Or2RQ5ZSQ8OHgr3GBw7koDWR8=
>>>>>>> bdbda7fd3df8b65569c06f79a6ea93536ec6ea2e
# SIG # End signature block
