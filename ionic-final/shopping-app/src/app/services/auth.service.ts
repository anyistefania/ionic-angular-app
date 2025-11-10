import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
         signOut, updateProfile, User as FirebaseUser, onAuthStateChanged } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/models.model';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<FirebaseUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private userDataSubject = new BehaviorSubject<User | null>(null);
  public userData$ = this.userDataSubject.asObservable();

  constructor(
    private auth: Auth,
    private router: Router,
    private firestoreService: FirestoreService
  ) {
    // Observar cambios en el estado de autenticación
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUserSubject.next(user);
      if (user) {
        // Cargar datos del usuario desde Firestore
        this.firestoreService.getUserData(user.uid).subscribe(
          userData => this.userDataSubject.next(userData)
        );
      } else {
        this.userDataSubject.next(null);
      }
    });
  }

  // Obtener usuario actual de Firebase Auth
  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }

  // Obtener datos completos del usuario
  getUserData(): User | null {
    return this.userDataSubject.value;
  }

  // Verificar si el usuario es admin
  isAdmin(): boolean {
    const userData = this.userDataSubject.value;
    return userData?.role === 'admin';
  }

  // Verificar el rol del usuario
  getUserRole(): UserRole | null {
    const userData = this.userDataSubject.value;
    return userData?.role || null;
  }

  // Registro de nuevo usuario
  async register(email: string, password: string, displayName: string, role: UserRole = 'user'): Promise<any> {
    try {
      const credential = await createUserWithEmailAndPassword(this.auth, email, password);

      // Actualizar perfil con nombre
      if (credential.user) {
        await updateProfile(credential.user, { displayName });

        // Guardar datos adicionales del usuario en Firestore
        const userData: User = {
          uid: credential.user.uid,
          email: credential.user.email!,
          displayName: displayName,
          role: role,
          createdAt: new Date()
        };

        await this.firestoreService.saveUserData(credential.user.uid, userData);
      }

      return { success: true, user: credential.user };
    } catch (error: any) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Login
  async login(email: string, password: string): Promise<any> {
    try {
      const credential = await signInWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: credential.user };
    } catch (error: any) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Logout
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }

  // Actualizar perfil
  async updateUserProfile(displayName?: string, photoURL?: string, phoneNumber?: string): Promise<any> {
    try {
      const user = this.auth.currentUser;
      if (!user) {
        return { success: false, error: 'No hay usuario autenticado' };
      }

      const authUpdates: any = {};
      if (displayName) authUpdates.displayName = displayName;
      if (photoURL) authUpdates.photoURL = photoURL;

      await updateProfile(user, authUpdates);

      // Actualizar también en Firestore
      const firestoreUpdates: Partial<User> = {};
      if (displayName) firestoreUpdates.displayName = displayName;
      if (photoURL) firestoreUpdates.photoURL = photoURL;
      if (phoneNumber) firestoreUpdates.phoneNumber = phoneNumber;

      if (Object.keys(firestoreUpdates).length > 0) {
        await this.firestoreService.updateUserData(user.uid, firestoreUpdates);
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }

  // Mensajes de error en español
  private getErrorMessage(code: string): string {
    const errors: any = {
      'auth/email-already-in-use': 'El email ya está registrado',
      'auth/invalid-email': 'Email inválido',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/user-disabled': 'Usuario deshabilitado',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos, intenta más tarde'
    };
    return errors[code] || 'Error en la autenticación';
  }
}