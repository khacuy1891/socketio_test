#!/usr/bin/python
# build_native.py
# Build native codes
# 
# Please use cocos console instead


import sys
import os, os.path
import shutil
from optparse import OptionParser

current_dir = os.path.dirname(os.path.realpath(__file__))
os.system('cls')
print '==================================================='
command = 'node socket_server.js'
print command
print '==================================================='
os.system(command)

